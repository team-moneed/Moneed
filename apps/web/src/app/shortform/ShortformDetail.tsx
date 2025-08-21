import { Shorts } from '@/generated/prisma';

interface ShortformDetailProps {
    video: Shorts;
    setVideoId: (videoId: string | null) => void;
}

const ShortformDetail = (props: ShortformDetailProps) => {
    const { video, setVideoId } = props;

    return (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col'>
            <button
                onClick={() => setVideoId(null)}
                className='absolute top-4 right-4 text-white text-xl z-50 bg-black bg-opacity-50 rounded px-3 py-1'
            >
                ✕
            </button>
            <div className='flex-1 flex justify-center items-center px-4'>
                <iframe
                    width='360'
                    height='640'
                    src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0`}
                    title={video.title}
                    allow='autoplay; fullscreen; encrypted-media'
                    allowFullScreen
                    className='rounded-lg shadow-lg'
                />
            </div>
        </div>
    );
};

export default ShortformDetail;
