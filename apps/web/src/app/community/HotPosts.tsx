'use client';

import { PostThumbnailSkeletons } from '@/components/Skeletons/PostThumbnailSkeleton';
import HotPostThumbnail from './HotPostThumbnail';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useSuspenseHotPosts } from '@/queries/posts.query';
import withSuspense from '@/components/HOC/withSuspense';

function HotPosts() {
    const { data: posts, fetchNextPage, hasNextPage } = useSuspenseHotPosts();

    const ref = useIntersectionObserver({
        onIntersect: () => {
            if (hasNextPage) {
                fetchNextPage();
            }
        },
    });

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-y-[.6rem] gap-x-[1.6rem] mt-4 md:gap-y-[1.2rem]'>
            {posts.map(post => (
                <HotPostThumbnail key={post.id} post={post} />
            ))}
            <div ref={ref}></div>
        </div>
    );
}

export default withSuspense(HotPosts, <PostThumbnailSkeletons count={15} />);
