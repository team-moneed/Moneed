import { cn } from '@/6_shared/utils/style';

export default function ShortsIframe({
    videoId,
    title,
    className,
}: {
    videoId: string;
    title: string;
    className?: string;
}) {
    return (
        <iframe
            className={cn('w-full h-full pointer-events-none', className)}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${videoId}`}
            title={title}
            allow='autoplay; encrypted-media'
            allowFullScreen
        />
    );
}
