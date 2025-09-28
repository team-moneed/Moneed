'use client';

import VideoCarousel from '@/2_screens/home/ui/VideoCarousel';
import { EmblaOptionsType } from 'embla-carousel';
import { useSuspenseShorts } from '@/4_features/shorts/query/shorts.query';

export default function MainShortforms() {
    const VIDEOOPTIONS: EmblaOptionsType = {
        slidesToScroll: 1,
        loop: false,
        align: 'start',
        containScroll: 'trimSnaps',
    };

    const { data: shorts } = useSuspenseShorts({ videoId: '', limit: 10 });

    return (
        <>
            <div className='mt-4'>{shorts && <VideoCarousel videos={shorts} options={VIDEOOPTIONS} />}</div>
        </>
    );
}
