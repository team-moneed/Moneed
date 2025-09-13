import type { CreatePostForm, CreatePostRequestDTO, Post, PostDTO } from './post.type';

export class PostMapper {
    static toPost(post: PostDTO, currentUserId?: string): Post {
        return {
            id: post.id,
            title: post.title,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt || post.createdAt,
            stock: post.stock,
            author: post.user,
            thumbnailImage: post.thumbnailImage || null,
            score: post.score,
            likes: post.postLikes.length,
            views: post.postViews.length,
            isLiked: currentUserId ? post.postLikes.some(like => like.userId === currentUserId) : false,
            isViewed: currentUserId ? post.postViews.some(view => view.userId === currentUserId) : false,
        };
    }

    static toCreateDTO(form: CreatePostForm): CreatePostRequestDTO {
        return {
            symbol: form.symbol,
            title: form.title,
            content: form.content,
            thumbnailImage: form.thumbnailImage || null,
        };
    }
}
