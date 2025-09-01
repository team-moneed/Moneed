'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useInfiniteShorts, useShort } from '@/queries/shorts.query';
import { ShortformPageSkeleton } from '@/components/Skeletons/shortform/ShortformSkeleton';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

// TODO: 추후 현재 쇼츠 자동 재생 로직 추가
function ShortformVideoPage() {
    const { videoId } = useParams();
    const router = useRouter();
    const { data: video } = useShort({ videoId: videoId as string });
    const {
        data: videos = [],
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteShorts({ cursor: videoId as string, limit: 5 });
    const [isClient, setIsClient] = useState(false);

    const ref = useIntersectionObserver({
        onIntersect: fetchNextPage,
        options: {
            rootMargin: '100px',
            threshold: 0.1,
        },
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    // 클라이언트에서만 렌더링하여 hydration mismatch 방지
    if (!isClient) {
        return <ShortformPageSkeleton count={20} />;
    }

    return (
        <>
            <div className='h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-moneed-white lg:flex lg:flex-col lg:items-center'>
                {[...(video ? [video] : []), ...videos].map((video, index) => {
                    const isCurrentVideo = video.videoId === videoId;
                    return (
                        <div
                            key={`${video.videoId}-${index}`}
                            className='h-[calc(100vh-76px-55px)] lg:h-[calc(100vh-76px)] w-full snap-start relative bg-moneed-white shrink-0'
                        >
                            <div className='w-full h-full flex items-center justify-center'>
                                <iframe
                                    className='w-full h-full mx-auto'
                                    src={`https://www.youtube.com/embed/${video.videoId}?autoplay=${isCurrentVideo ? 1 : 0}&mute=0&controls=1&modestbranding=1&rel=0&loop=1&playlist=${video.videoId}&playsinline=1`}
                                    title={video.title}
                                    allow='autoplay; encrypted-media; picture-in-picture'
                                    allowFullScreen
                                >
                                    <a
                                        href={`https://www.youtube.com/watch?v=${video.videoId}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        동영상 바로가기
                                    </a>
                                </iframe>
                            </div>
                            {/* 뒤로가기 버튼 */}
                            <button
                                onClick={() => router.push('/shortform')}
                                className='absolute top-4 left-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors'
                            >
                                <img src='/icon/icon-arrow-back.svg' alt='back' className='size-10' />
                            </button>
                        </div>
                    );
                })}

                {!isFetchingNextPage && hasNextPage && (
                    <div
                        ref={ref}
                        className='h-[calc(100vh-76px-55px)] lg:h-[calc(100vh-76px)] w-full snap-start relative bg-moneed-white shrink-0'
                    />
                )}
                {isFetchingNextPage && (
                    <div className='h-[calc(100vh-76px-55px)] lg:h-[calc(100vh-76px)] w-full snap-start relative bg-moneed-white shrink-0'></div>
                )}
            </div>
        </>
    );
}

export default ShortformVideoPage;
