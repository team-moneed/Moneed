import 'server-only';
import { prisma } from '@/shared/model';
import { CommunityDTO } from '@/features/community/model';
import { PostDTO } from '../model/post.type';

export class PostRepository {
    private prisma = prisma;

    async getUserPosts({ userId, limit, cursor }: { userId: string; limit?: number; cursor?: Date }) {
        return this.prisma.post.findMany({
            where: { userId, createdAt: { lt: cursor } },
            include: {
                postLikes: true,
                postViews: true,
                user: true,
                stock: true,
                comments: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });
    }

    /**
     * 점수 기반 상위 게시물 조회
     * Score = (V + 3L + 5C) × 1 / (T + 2)^1.8
     * @param limit 조회할 게시글 수
     * @param cursor 점수 기준 커서
     * @returns 점수순으로 정렬된 게시글 목록
     */
    async getPostsByScore({ limit, cursor }: { limit: number; cursor?: number }) {
        const posts = await this.prisma.post.findMany({
            where: {
                score: {
                    lt: cursor,
                },
            },
            include: {
                postLikes: true,
                postViews: true,
                user: true,
                stock: true,
                comments: true,
            },
            orderBy: {
                score: 'desc',
            },
            take: limit,
        });

        // 각 게시물의 점수를 계산하고 정렬
        const postsWithScores = posts.map(post => {
            const score = calcScore({
                views: post.postViews.length,
                likes: post.postLikes.length,
                comments: post.comments.length,
                createdAt: post.createdAt,
            });

            return {
                ...post,
                score,
            };
        });

        await Promise.all(postsWithScores.map(post => this.setPostsScore({ postId: post.id, score: post.score })));

        return postsWithScores.sort((a, b) => b.score - a.score).slice(0, limit);
    }

    async setPostsScore({ postId, score }: { postId: number; score: number }) {
        await this.prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                score,
            },
        });
    }

    /**
     * 특정 종목의 게시글 조회 (확장)
     * @param stockSymbol 종목 심볼
     * @param limit 조회할 게시글 수
     * @returns 게시글 목록
     */
    async getPostsWithUserByStockId({ stockSymbol, limit }: { stockSymbol: string; limit: number }) {
        const posts = await this.prisma.post.findMany({
            where: {
                stockSymbol,
            },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        profileImage: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });

        return posts;
    }

    async getBoardRankWithInHours({ limit, hours }: { limit: number; hours: number }): Promise<CommunityDTO[]> {
        const hoursAgo = new Date(Date.now() - 1000 * 60 * 60 * hours);
        const boardsWithInHours = (await this.prisma.$queryRaw`
            SELECT 
                p."stockSymbol",
                (SELECT s."nameKo" FROM stocks s WHERE s.symbol = p."stockSymbol") as "stockName",
                (SELECT s.symbol FROM stocks s WHERE s.symbol = p."stockSymbol") as "symbol",
                COUNT(DISTINCT p.id) as "postCount",
                COALESCE(
                    (SELECT COUNT(pl.id) 
                     FROM post_likes pl 
                     JOIN posts p2 ON pl."postId" = p2.id 
                     WHERE p2."stockSymbol" = p."stockSymbol" 
                     AND pl."createdAt" >= ${hoursAgo}), 
                    0
                ) as "totalLikes",
                COALESCE(
                    (SELECT COUNT(pv.id) 
                     FROM post_views pv 
                     JOIN posts p2 ON pv."postId" = p2.id 
                     WHERE p2."stockSymbol" = p."stockSymbol" 
                     AND pv."createdAt" >= ${hoursAgo}), 
                    0
                ) as "totalViews",
                COALESCE(
                    (SELECT COUNT(c.id) 
                     FROM comments c 
                     JOIN posts p2 ON c."postId" = p2.id 
                     WHERE p2."stockSymbol" = p."stockSymbol" 
                     AND p2."createdAt" >= ${hoursAgo}), 
                    0
                ) as "totalComments"
            FROM posts p
            WHERE p."createdAt" >= ${hoursAgo}
            GROUP BY p."stockSymbol"
            ORDER BY "postCount" DESC, "totalViews" DESC, "totalLikes" DESC, "totalComments" DESC
            LIMIT ${limit}
        `) as Array<{
            stockSymbol: string;
            stockName: string;
            symbol: string;
            postCount: bigint;
            totalViews: bigint;
            totalLikes: bigint;
            totalComments: bigint;
        }>;

        // BigInt를 number로 변환합니다
        return boardsWithInHours.map(item => ({
            stockSymbol: item.stockSymbol,
            stockName: item.stockName,
            symbol: item.symbol,
            postCount: Number(item.postCount),
            totalViews: Number(item.totalViews),
            totalLikes: Number(item.totalLikes),
            totalComments: Number(item.totalComments),
        }));
    }

    async getBoardRank({ offset, limit }: { offset: number; limit: number }): Promise<CommunityDTO[]> {
        const boards = (await this.prisma.$queryRaw`
            SELECT 
                p."stockSymbol",
                (SELECT s."nameKo" FROM stocks s WHERE s.symbol = p."stockSymbol") as "stockName", 
                (SELECT s.symbol FROM stocks s WHERE s.symbol = p."stockSymbol") as "symbol",
                COUNT(DISTINCT p.id) as "postCount",
                COALESCE(
                    (SELECT COUNT(pl.id) 
                     FROM post_likes pl 
                     JOIN posts p2 ON pl."postId" = p2.id 
                     WHERE p2."stockSymbol" = p."stockSymbol"), 
                    0
                ) as "totalLikes",
                COALESCE(
                    (SELECT COUNT(pv.id) 
                     FROM post_views pv 
                     JOIN posts p2 ON pv."postId" = p2.id 
                     WHERE p2."stockSymbol" = p."stockSymbol"), 
                    0
                ) as "totalViews",
                COALESCE(
                    (SELECT COUNT(c.id) 
                     FROM comments c 
                     JOIN posts p2 ON c."postId" = p2.id 
                     WHERE p2."stockSymbol" = p."stockSymbol"), 
                    0
                ) as "totalComments"
            FROM posts p
            GROUP BY p."stockSymbol"
            ORDER BY "postCount" DESC, "totalViews" DESC, "totalLikes" DESC, "totalComments" DESC
            OFFSET ${offset}
            LIMIT ${limit}
        `) as Array<{
            stockSymbol: string;
            stockName: string;
            symbol: string;
            postCount: bigint;
            totalViews: bigint;
            totalLikes: bigint;
            totalComments: bigint;
        }>;

        return boards.map(item => ({
            stockSymbol: item.stockSymbol,
            stockName: item.stockName,
            symbol: item.symbol,
            postCount: Number(item.postCount),
            totalViews: Number(item.totalViews),
            totalLikes: Number(item.totalLikes),
            totalComments: Number(item.totalComments),
        }));
    }

    async createPost({
        userId,
        title,
        content,
        stockSymbol,
        thumbnailImage,
    }: {
        userId: string;
        title: string;
        content: string;
        stockSymbol: string;
        thumbnailImage?: string;
    }): Promise<PostDTO> {
        const post = await this.prisma.post.create({
            data: {
                userId,
                title,
                content,
                stockSymbol,
                thumbnailImage,
            },
            include: {
                stock: true,
                user: true,
                postLikes: true,
                postViews: true,
                comments: true,
            },
        });
        return post;
    }

    async deletePost({ postId, userId }: { postId: number; userId: string }) {
        return await this.prisma.post.delete({
            where: {
                id: postId,
                userId,
            },
        });
    }

    async updatePost({
        postId,
        userId,
        title,
        content,
        thumbnailImageUrl,
    }: {
        postId: number;
        userId: string;
        title: string;
        content: string;
        thumbnailImageUrl?: string | null;
    }) {
        return await this.prisma.post.update({
            where: {
                id: postId,
                userId,
            },
            data: {
                title,
                content,
                thumbnailImage: thumbnailImageUrl,
            },
        });
    }

    async getPost({ postId }: { postId: number }) {
        return await this.prisma.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                postLikes: true,
                postViews: true,
                user: true,
                stock: true,
            },
        });
    }

    async getPosts({ symbol, cursor, limit }: { symbol?: string; cursor?: Date; limit?: number }) {
        return this.prisma.post.findMany({
            where: { stockSymbol: symbol, createdAt: { lt: cursor } },
            include: {
                postLikes: true,
                postViews: true,
                user: true,
                stock: true,
                comments: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });
    }

    async getPostImageUrl({ postId }: { postId: number }) {
        return await this.prisma.post.findUnique({
            where: { id: postId },
            select: { thumbnailImage: true },
        });
    }

    async likePost({ postId, userId }: { postId: number; userId: string }) {
        return await this.prisma.postLike.create({
            data: { postId, userId },
        });
    }

    async unlikePost({ postId, userId }: { postId: number; userId: string }) {
        return await this.prisma.postLike.delete({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        });
    }
}

function calcScore({
    views,
    likes,
    comments,
    createdAt,
}: {
    views: number;
    likes: number;
    comments: number;
    createdAt: Date;
}): number {
    const now = new Date();
    const timeDiffMs = now.getTime() - createdAt.getTime();
    const timeDiffDays = timeDiffMs / (1000 * 60 * 60 * 24); // 일 단위로 변환

    // Score = (V + 3L + 5C) × 1 / (T + 2)^1.8
    const score = (views + 3 * likes + 5 * comments) * (1 / Math.pow(timeDiffDays + 2, 1.8));

    return score;
}
