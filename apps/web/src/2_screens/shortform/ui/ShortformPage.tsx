'use client';

import { useRouter } from 'next/navigation';
import { useSuspenseInfiniteShorts } from '@/4_features/shorts/query/shorts.query';
import { useIntersectionObserver } from '@/6_shared/hooks/useIntersectionObserver';
import { ShortformPageSkeleton } from '@/2_screens/shortform/ui/ShortformSkeleton';
import { DYNAMIC_PATH } from '@/6_shared/config';
import ShortsCard from '@/5_entities/shorts/ui/ShortsCard';
import { useState } from 'react';

export const dynamic = 'force-dynamic';

export default function ShortformPage() {
    const router = useRouter();
    const [hoverVideoId, setHoverVideoId] = useState<string | null>(null);
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

    return (
        <div className='h-full overflow-y-auto px-[1.8rem] lg:px-0 max-w-512 mx-auto'>
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-y-[1.6rem] gap-x-[1.6rem] mt-4 md:gap-y-[1.6rem] mb-[.6rem]'>
                {videos.map(video => (
                    <div
                        key={video.videoId}
                        className='overflow-hidden rounded-lg cursor-pointer'
                        onClick={() => router.push(DYNAMIC_PATH.SHORTFORM_VIDEO(video.videoId))}
                        onMouseEnter={() => setHoverVideoId(video.videoId)}
                        onMouseLeave={() => setHoverVideoId(null)}
                    >
                        <div className='aspect-[9/16] min-h-[200px] relative hover:scale-105 transition-transform duration-200'>
                            <ShortsCard video={video} isHovered={hoverVideoId === video.videoId} />
                        </div>
                    </div>
                ))}
            </div>
            {isFetchingNextPage && <ShortformPageSkeleton count={20} />}
            {!hasNextPage && (
                <div className='w-full h-96 flex items-center justify-center text-moneed-gray-500 text-2xl'>
                    마지막 페이지입니다.
                </div>
            )}
            <div ref={ref} className='h-[1px]' />
        </div>
    );
}
