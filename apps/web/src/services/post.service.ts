import PostRepository from '@/repositories/post.repository';
import { CreatePostRequest, PostDetail, PostThumbnail, TopPostThumbnail, UpdatePostRequest } from '@/types/post';
import S3Service from './s3.service';
import { urlToS3FileName } from '@/utils/parser';
import { isFile } from '@/utils/typeChecker';
import { StockService } from './stock.service';
import { BoardRankResponse } from '@/types/board';

export default class PostService {
    private readonly postRepository = new PostRepository();
    private readonly stockService = new StockService();

    // 24시간 내 게시판 순위 조회 (게시글 수 > 조회수 > 좋아요수 > 댓글수)
    async getBoardRank({ limit }: { limit: number }) {
        const boardRankWithInHours = await this.postRepository.getBoardRankWithInHours({ limit, hours: 24 });
        let result: BoardRankResponse[] = [];
        if (boardRankWithInHours.length === limit) {
            result = boardRankWithInHours;
        } else {
            const boardRank = await this.postRepository.getBoardRank({
                offset: boardRankWithInHours.length,
                limit: limit - boardRankWithInHours.length,
            });
            result = [...boardRankWithInHours, ...boardRank];
        }
        result = await Promise.all(
            result.map(async item => ({
                ...item,
                stockName: await this.stockService.getKoreanStockName(item.stockSymbol),
            })),
        );
        return result;
    }

    async getBoardTopPosts({ symbol, limit }: { symbol: string; limit: number }) {
        const postList = await this.postRepository.getPostsWithUser({ stockSymbol: symbol, limit });
        return postList;
    }

    async getTopPosts({ limit = 5 }: { limit?: number } = {}): Promise<TopPostThumbnail[]> {
        const postList = await this.postRepository.getPostsByScore({ limit });

        const postThumbnailList = await Promise.all(
            postList.map(async post => ({
                id: post.id,
                title: post.title,
                content: post.content,
                createdAt: post.createdAt,
                user: {
                    id: post.user.id,
                    nickname: post.user.nickname,
                    profileImage: post.user.profileImage,
                },
                score: post.score,
                stock: {
                    id: post.stock.id,
                    symbol: post.stock.symbol,
                    name: await this.stockService.getKoreanStockName(post.stock.symbol),
                },
            })),
        );

        return postThumbnailList;
    }

    async getHotPosts({ limit = 15, cursor = 0, userId }: { limit?: number; cursor?: number; userId?: string } = {}) {
        const postList = await this.postRepository.getPostsByScore({ limit, cursor });

        const postThumbnailList = await Promise.all(
            postList.map(async post => ({
                ...post,
                isLiked: post.postLikes.some(like => like.userId === userId),
                likeCount: post.postLikes.length,
                commentCount: post.comments.length,
                stock: {
                    id: post.stock.id,
                    symbol: post.stock.symbol,
                    name: await this.stockService.getKoreanStockName(post.stock.symbol),
                },
                thumbnailImage: post.thumbnailImage ?? undefined,
            })),
        );

        return postThumbnailList;
    }

    async getPost({ userId, postId }: { userId?: string; postId: number }): Promise<PostDetail> {
        const post = await this.postRepository.getPost({ postId });
        if (!post) {
            throw new Error('Post not found');
        }
        return {
            ...post,
            createdAt: post.createdAt,
            isLiked: post.postLikes.some(like => like.userId === userId),
            likeCount: post.postLikes.length,
            comments: post.comments,
            thumbnailImage: post.thumbnailImage ?? undefined,
        };
    }

    async getPostsWithUserExtended({
        stockSymbol,
        cursor,
        limit,
        userId,
    }: {
        stockSymbol?: string;
        cursor?: Date;
        limit?: number;
        userId?: string;
    }): Promise<PostThumbnail[]> {
        const postList = await this.postRepository.getPostsWithUserExtended({ stockSymbol, cursor, limit });
        const postThumbnailList: PostThumbnail[] = await Promise.all(
            postList.map(async post => ({
                id: post.id,
                title: post.title,
                content: post.content,
                createdAt: post.createdAt.toISOString(),
                isLiked: post.postLikes.some(like => like.userId === userId),
                likeCount: post.postLikes.length,
                commentCount: post.comments.length,
                stock: {
                    id: post.stock.id,
                    symbol: post.stock.symbol,
                    name: await this.stockService.getKoreanStockName(post.stock.symbol),
                },
                thumbnailImage: post.thumbnailImage ?? undefined,
                user: post.user,
            })),
        );
        return postThumbnailList;
    }

    async createPost({ userId, title, content, symbol, thumbnailImage }: CreatePostRequest & { userId: string }) {
        const s3Service = new S3Service();
        let uploadedImageUrl: string | undefined;
        if (thumbnailImage) {
            uploadedImageUrl = await s3Service.uploadImage('posts', thumbnailImage);
        }

        const post = await this.postRepository.createPost({
            userId,
            title,
            content,
            stockSymbol: symbol,
            thumbnailImage: uploadedImageUrl,
        });
        return post;
    }

    async deletePost({ postId, userId }: { postId: number; userId: string }) {
        const s3Service = new S3Service();
        const postImageUrl = await this.postRepository.getPostImageUrl({ postId });
        if (postImageUrl?.thumbnailImage) {
            await s3Service.deleteImage(urlToS3FileName(postImageUrl.thumbnailImage));
        }
        return await this.postRepository.deletePost({ postId, userId });
    }

    async updatePost({
        postId,
        userId,
        title,
        content,
        thumbnailImage,
        prevThumbnailImageUrl,
    }: UpdatePostRequest & { userId: string }) {
        const s3Service = new S3Service();
        let thumbnailImageUrl: string | undefined | null;
        if (thumbnailImage && prevThumbnailImageUrl) {
            // 썸네일 교체
            if (isFile(thumbnailImage)) {
                thumbnailImageUrl = await s3Service.uploadImage('posts', thumbnailImage);
                await s3Service.deleteImage(urlToS3FileName(prevThumbnailImageUrl));
            }
            // 썸네일 유지 (이미 썸네일이 있던 상태)
            else if (typeof thumbnailImage === 'string') {
                thumbnailImageUrl = undefined;
            }
        } else if (thumbnailImage && !prevThumbnailImageUrl) {
            // 썸네일 추가
            if (isFile(thumbnailImage)) {
                thumbnailImageUrl = await s3Service.uploadImage('posts', thumbnailImage);
            }
        } else if (!thumbnailImage && prevThumbnailImageUrl) {
            // 썸네일 삭제
            if (prevThumbnailImageUrl) {
                thumbnailImageUrl = null;
                await s3Service.deleteImage(urlToS3FileName(prevThumbnailImageUrl));
            }
        } else if (!thumbnailImage && !prevThumbnailImageUrl) {
            // 썸네일 유지 (썸네일이 없던 상태)
            thumbnailImageUrl = undefined;
        }

        return await this.postRepository.updatePost({
            postId,
            userId,
            title,
            content,
            thumbnailImageUrl,
        });
    }

    async likePost({ postId, userId }: { postId: number; userId: string }) {
        return await this.postRepository.likePost({ postId, userId });
    }

    async unlikePost({ postId, userId }: { postId: number; userId: string }) {
        return await this.postRepository.unlikePost({ postId, userId });
    }
}
