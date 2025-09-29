'use client';

import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import NextButton from '@/6_shared/ui/Button/NextButton';
import PrevButton from '@/6_shared/ui/Button/PrevButton';
import { usePrevNextButtons } from '@/6_shared/hooks/usePrevNextButtons';
import { cn } from '@/6_shared/utils/style';
import { useRouter } from 'next/navigation';
import { DYNAMIC_PATH } from '@/6_shared/config';
import { useState } from 'react';
import ShortsCard from '@/5_entities/shorts/ui/ShortsCard';
import { useIntersectionObserver } from '@/6_shared/hooks/useIntersectionObserver';
import { useInfiniteShorts } from '@/4_features/shorts/query/shorts.query';
import { ShortformCarouselSkeleton } from '@/2_screens/shortform/ui/ShortformSkeleton';

const VideoCarousel = ({ count }: { count: number }) => {
    const VIDEOOPTIONS: EmblaOptionsType = {
        slidesToScroll: 'auto',
        loop: false,
        align: 'start',
        containScroll: 'trimSnaps',
    };
    const {
        data: videos = [],
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        isLoading,
    } = useInfiniteShorts({ limit: count });

    const ref = useIntersectionObserver({
        onIntersect: () => {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        options: {
            rootMargin: '100px',
            threshold: 0.1,
        },
    });

    const [emblaRef, emblaApi] = useEmblaCarousel(VIDEOOPTIONS);
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
                            key={video.videoId}
                            style={{ aspectRatio: '9/16' }}
                            onClick={() => router.push(DYNAMIC_PATH.SHORTFORM_VIDEO(video.videoId))}
                            onMouseEnter={() => setHoverVideoId(video.videoId)}
                            onMouseLeave={() => setHoverVideoId(null)}
                        >
                            <ShortsCard video={video} isHovered={hoverVideoId === video.videoId} />
                        </div>
                    ))}
                    {(isFetchingNextPage || isLoading) && <ShortformCarouselSkeleton count={count} />}
                    {hasNextPage && <div ref={ref} className='h-[1px]' />}
                </div>
            </div>
            <PrevButton
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
                className={cn(
                    'absolute top-1/2 left-2 transform -translate-y-1/2 z-10 p-[1.2rem] rounded-4xl bg-moneed-gray-5 disabled:opacity-50',
                )}
            />
            <NextButton
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled || isFetchingNextPage}
                className={cn(
                    'absolute top-1/2 right-2 transform -translate-y-1/2 z-10 p-[1.2rem] rounded-4xl bg-moneed-gray-5 disabled:opacity-50',
                )}
            />
        </div>
    );
};

export default VideoCarousel;
