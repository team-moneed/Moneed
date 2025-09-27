'use client';

import VideoCarousel from '@/6_shared/ui/Carousel/VideoCarousel';
import { EmblaOptionsType } from 'embla-carousel';
import { useSuspenseShorts } from '@/4_features/shorts/query/shorts.query';
import withSuspense from '@/6_shared/ui/withSuspense';
import { ShortformCarouselSkeleton } from '@/2_screens/shortform/ui/ShortformSkeleton';

const MainShortforms = () => {
    const VIDEOOPTIONS: EmblaOptionsType = {
        slidesToScroll: 1,
        loop: true,
        align: 'start',
        // draggable: true,
        containScroll: 'trimSnaps',
    };

    const { data: shorts } = useSuspenseShorts({ videoId: '', limit: 10 });

    return (
        <>
            <div className='mt-4'>{shorts && <VideoCarousel videos={shorts} options={VIDEOOPTIONS} />}</div>
        </>
    );
};

export default withSuspense(MainShortforms, <ShortformCarouselSkeleton count={10} />);
