'use client';
import { useIntersectionObserver } from '@/6_shared/hooks/useIntersectionObserver';
import PostThumbnail from '@/4_features/post/ui/PostThumbnail';
import { useInfinitePosts } from '@/4_features/post/query';

type PostsProps = {
    symbol: string;
};

const Posts = ({ symbol }: PostsProps) => {
    const { data: posts, hasNextPage, fetchNextPage } = useInfinitePosts({ symbol });

    const ref = useIntersectionObserver({
        onIntersect: () => {
            if (hasNextPage) {
                fetchNextPage();
            }
        },
    });

    return (
        <>
            {posts.map(post => (
                <PostThumbnail key={post.id} post={post} />
            ))}
            <div ref={ref}></div>
        </>
    );
};

export default Posts;
