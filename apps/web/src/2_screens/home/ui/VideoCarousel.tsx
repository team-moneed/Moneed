'use client';

import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import NextButton from '@/6_shared/ui/Button/NextButton';
import PrevButton from '@/6_shared/ui/Button/PrevButton';
import { usePrevNextButtons } from '@/6_shared/hooks/usePrevNextButtons';
import { cn } from '@/6_shared/utils/style';
import type { Shorts } from '@/5_entities/shorts/api/type';
import { useRouter } from 'next/navigation';
import { DYNAMIC_PATH } from '@/6_shared/config';
import { useState } from 'react';
import ShortsCard from '@/5_entities/shorts/ui/ShortsCard';

type PropType = {
    videos: Shorts[];
    options?: EmblaOptionsType;
    slidesToShow?: number;
};
const VideoCarousel = (props: PropType) => {
    const { videos, options } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel(options);
    const { nextBtnDisabled, onNextButtonClick, prevBtnDisabled, onPrevButtonClick } = usePrevNextButtons(emblaApi);
    const router = useRouter();
    const [hoverVideoId, setHoverVideoId] = useState<string | null>(null);

    return (
        <div className='relative lg:pr-[5.6rem]'>
            <div className='w-full overflow-hidden mask-right' ref={emblaRef}>
                <div className='flex gap-[.8rem]'>
                    {videos.map(video => (
                        <div
                            className='w-[calc(30%-1.6rem)] lg:w-[calc(20%-1.6rem)] shrink-0 cursor-pointer'
                            key={video.id}
                            style={{ aspectRatio: '9/16' }}
                            onClick={() => router.push(DYNAMIC_PATH.SHORTFORM_VIDEO(video.videoId))}
                            onMouseEnter={() => setHoverVideoId(video.videoId)}
                            onMouseLeave={() => setHoverVideoId(null)}
                        >
                            <ShortsCard video={video} isHovered={hoverVideoId === video.videoId} />
                        </div>
                    ))}
                </div>
            </div>
            <PrevButton
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
                className={cn(
                    'hidden lg:absolute lg:block top-1/2 left-2 transform -translate-y-1/2 z-10 p-[1.2rem] rounded-4xl bg-moneed-gray-5',
                    prevBtnDisabled && 'lg:hidden',
                )}
            />
            <NextButton
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
                className='hidden lg:absolute lg:block top-1/2 right-2 transform -translate-y-1/2 z-10 p-[1.2rem] rounded-4xl bg-moneed-gray-5'
            />
        </div>
    );
};

export default VideoCarousel;
