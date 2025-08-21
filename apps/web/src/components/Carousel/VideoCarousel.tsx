'use client';

import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { NextButton, PrevButton } from '@/components/Carousel/CarouselArrowButton';
import { usePrevNextButtons } from '@/hooks/usePrevNextButtons';
import { useState } from 'react';
import ShortformDetail from '@/app/shortform/ShortformDetail';
import { cn } from '@/utils/style';
import { Shorts } from '@/generated/prisma';

type PropType = {
    videos: Shorts[];
    options?: EmblaOptionsType;
    slidesToShow?: number;
};
const VideoCarousel = (props: PropType) => {
    const { videos, options } = props;
    const [emblaRef, emblaApi] = useEmblaCarousel({
        ...options,
        loop: false,
        // wrapAround: true,
        // slidesToShow,
    });
    const { nextBtnDisabled, onNextButtonClick, prevBtnDisabled, onPrevButtonClick } = usePrevNextButtons(emblaApi);
    const [videoId, setVideoId] = useState<string | null>(null);
    const video = videos.find(video => video.videoId === videoId);

    return (
        <div className='relative lg:pr-[5.6rem]'>
            <div className='w-full overflow-hidden mask-right' ref={emblaRef}>
                <div className='flex gap-[.8rem]'>
                    {videos.map((video, index) => (
                        <div
                            className='w-[calc(30%-1.6rem)] lg:w-[calc(20%-1.6rem)] shrink-0 cursor-pointer'
                            key={index}
                            style={{ aspectRatio: '9/16' }}
                            onClick={() => setVideoId(video.videoId)}
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
            {video && <ShortformDetail video={video} setVideoId={setVideoId} />}
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
