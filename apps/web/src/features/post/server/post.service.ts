import { PostRepository } from '@/entities/post/server';
import { UpdatePostRequest } from '@/features/post/model/post.type';
import { CreatePostRequestDTO } from '@/entities/post/model/post.type';
import { S3Service } from '@/shared/model';
import { urlToS3FileName } from '@/shared/utils/parser';
import { isFile } from '@/shared/utils';
import { CommunityDTO } from '@/features/community/model';
import { PostDTO } from '@/entities/post/model/post.type';

export class PostService {
    private readonly postRepository = new PostRepository();

    // 24시간 내 게시판 순위 조회 (게시글 수 > 조회수 > 좋아요수 > 댓글수)
    async getBoardRank({ limit }: { limit: number }) {
        const boardRankWithInHours = await this.postRepository.getBoardRankWithInHours({ limit, hours: 24 });
        let result: CommunityDTO[] = [];
        if (boardRankWithInHours.length === limit) {
            result = boardRankWithInHours;
        } else {
            const boardRank = await this.postRepository.getBoardRank({
                offset: boardRankWithInHours.length,
                limit: limit - boardRankWithInHours.length,
            });
            result = [...boardRankWithInHours, ...boardRank];
        }
        return result;
    }

    async getBoardTopPosts({ symbol, limit }: { symbol: string; limit: number }): Promise<PostDTO[]> {
        const postList = await this.postRepository.getPosts({ symbol, limit });
        return postList;
    }

    async getTopPosts({ limit = 5 }: { limit?: number } = {}): Promise<PostDTO[]> {
        const posts = await this.postRepository.getPostsByScore({ limit });
        return posts;
    }

    async getHotPosts({ limit = 15, cursor = 0 }: { limit?: number; cursor?: number } = {}): Promise<PostDTO[]> {
        const posts = await this.postRepository.getPostsByScore({ limit, cursor });
        return posts;
    }

    async getPost({ postId }: { postId: number }): Promise<PostDTO> {
        const post = await this.postRepository.getPost({ postId });
        if (!post) {
            throw new Error('Post not found');
        }
        return post;
    }

    async getPostDetail({ postId }: { postId: number }): Promise<PostDTO> {
        const post = await this.postRepository.getPost({ postId });
        if (!post) {
            throw new Error('Post not found');
        }
        return post;
    }

    async getPosts({ symbol, cursor, limit }: { symbol?: string; cursor?: Date; limit?: number }): Promise<PostDTO[]> {
        const posts = await this.postRepository.getPosts({ symbol, cursor, limit });
        return posts;
    }

    async createPost({ userId, title, content, symbol, thumbnailImage }: CreatePostRequestDTO & { userId: string }) {
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
