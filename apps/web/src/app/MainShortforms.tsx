'use client';

import VideoCarousel from '@/components/Carousel/VideoCarousel';
import { EmblaOptionsType } from 'embla-carousel';
import { useSuspenseShorts } from '@/queries/shorts.query';
import withSuspense from '@/components/HOC/withSuspense';
import { ShortformCarouselSkeleton } from '@/components/Skeletons/shortform/ShortformSkeleton';

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
