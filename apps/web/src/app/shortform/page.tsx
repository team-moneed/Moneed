'use client';

import { useRouter } from 'next/navigation';
import { useSuspenseInfiniteShorts } from '@/queries/shorts.query';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { ShortformPageSkeleton } from '@/components/Skeletons/shortform/ShortformSkeleton';

export const dynamic = 'force-dynamic';

export default function ShortformPage() {
    const router = useRouter();

    const { data: videos, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteShorts({ limit: 20 });

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

    // 동영상 클릭 핸들러
    const handleVideoClick = (videoId: string) => {
        router.push(`/shortform/${videoId}`);
    };

    return (
        <div className='h-full overflow-y-auto px-[1.8rem] lg:px-0 max-w-512 mx-auto'>
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-y-[1.6rem] gap-x-[1.6rem] mt-4 md:gap-y-[1.6rem] mb-[.6rem]'>
                {videos.map((video, index) => (
                    <div
                        key={`${video.videoId}-${index}`}
                        className='overflow-hidden rounded-lg cursor-pointer'
                        onClick={() => handleVideoClick(video.videoId)}
                    >
                        <div className='aspect-[9/16] min-h-[200px] relative hover:scale-105 transition-transform duration-200'>
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
            {isFetchingNextPage && <ShortformPageSkeleton count={20} />}
            <div ref={ref} className='h-[1px]' />
        </div>
    );
}
