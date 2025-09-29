import { cn } from '@/6_shared/utils/style';
import { useEffect, useRef } from 'react';

interface ShortsIframeProps {
    videoId: string;
    title: string;
    className?: string;
    isHovered?: boolean;
}

export default function ShortsIframe({ videoId, title, className, isHovered = false }: ShortsIframeProps) {
    const iframe = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframe.current && isHovered && !iframe.current.src) {
            iframe.current.src = iframe.current.dataset.src || '';
        }
    }, [isHovered]);

    return (
        <iframe
            ref={iframe}
            className={cn('w-full h-full pointer-events-none', className)}
            data-src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${videoId}`}
            title={title}
            allow='autoplay; encrypted-media'
            allowFullScreen
        />
    );
}
