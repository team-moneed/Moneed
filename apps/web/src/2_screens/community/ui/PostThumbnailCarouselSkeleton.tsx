import PostCarousel from '@/6_shared/ui/Carousel/PostCarousel';
import PostThumbnailSkeleton from '../../../6_shared/ui/Skeletons/PostThumbnailSkeleton';

export default function PostThumbnailCarouselSkeleton({ count }: { count: number }) {
    return (
        <PostCarousel>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className='shrink-0 w-[calc(85%-1.6rem)] lg:w-[calc(50%+.8rem)]'>
                    <PostThumbnailSkeleton />
                </div>
            ))}
        </PostCarousel>
    );
}
