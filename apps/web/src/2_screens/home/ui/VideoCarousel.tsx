'use client';

import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import NextButton from '@/6_shared/ui/Button/NextButton';
import PrevButton from '@/6_shared/ui/Button/PrevButton';
import { usePrevNextButtons } from '@/6_shared/hooks/usePrevNextButtons';
import { cn } from '@/6_shared/utils/style';
import type { Shorts } from '@/4_features/shorts/api/type';
import { useRouter } from 'next/navigation';
import { DYNAMIC_PATH } from '@/6_shared/config';

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

    return (
        <div className='relative lg:pr-[5.6rem]'>
            <div className='w-full overflow-hidden mask-right' ref={emblaRef}>
                <div className='flex gap-[.8rem]'>
                    {videos.map((video, index) => (
                        <div
                            className='w-[calc(30%-1.6rem)] lg:w-[calc(20%-1.6rem)] shrink-0 cursor-pointer'
                            key={index}
                            style={{ aspectRatio: '9/16' }}
                            onClick={() => router.push(DYNAMIC_PATH.SHORTFORM_VIDEO(video.videoId))}
                        >
                            <div className='w-full h-full rounded-[.8rem] overflow-hidden'>
                                <iframe
                                    className='w-full h-full pointer-events-none'
                                    src={`https://www.youtube.com/embed/${video.videoId}?autoplay=0&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${video.videoId}`}
                                    title={video.title}
                                    allow='autoplay; encrypted-media'
                                    allowFullScreen
                                />
                            </div>
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
