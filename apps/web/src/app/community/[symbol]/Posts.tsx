'use client';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import PostThumbnail from '@/app/community/[symbol]/PostThumbnail';
import { useInfinitePosts } from '@/queries/posts.query';

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
