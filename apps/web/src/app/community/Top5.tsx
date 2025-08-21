'use client';

import PostCarousel from '@/components/Carousel/PostCarousel';
import Top5Thumbnail from './Top5Thumbnail';
import { useTopPosts } from '@/queries/posts.query';
import PostThumbnailCarouselSkeleton from '@/components/Skeletons/community/PostThumbnailCarouselSkeleton';
import withSuspense from '@/components/HOC/withSuspense';

function Top5() {
    const POSTOPTIONS = {
        slidesToScroll: 1,
        loop: false,
        // align: 'start',
        draggable: true,
        // containScroll: "keepSnaps",
    };

    const { data: topPosts = [] } = useTopPosts({ limit: 5 });

    return (
        <PostCarousel options={POSTOPTIONS}>
            {topPosts.map(post => (
                <div key={post.id} className='shrink-0 w-[calc(85%-1.6rem)] lg:w-[calc(50%+.8rem)]'>
                    <Top5Thumbnail posts={post} />
                </div>
            ))}
        </PostCarousel>
    );
}

export default withSuspense(Top5, <PostThumbnailCarouselSkeleton count={5} />);
