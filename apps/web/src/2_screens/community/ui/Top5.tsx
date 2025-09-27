'use client';

import PostCarousel from '@/6_shared/ui/Carousel/PostCarousel';
import Top5Thumbnail from './Top5Thumbnail';
import { useTopPosts } from '@/4_features/post/query';
import PostThumbnailCarouselSkeleton from '@/2_screens/community/ui/PostThumbnailCarouselSkeleton';
import withSuspense from '@/6_shared/ui/withSuspense';

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
                    <Top5Thumbnail post={post} />
                </div>
            ))}
        </PostCarousel>
    );
}

export default withSuspense(Top5, <PostThumbnailCarouselSkeleton count={5} />);
