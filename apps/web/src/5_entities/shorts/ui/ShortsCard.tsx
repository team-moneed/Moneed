import { Shorts } from '@/5_entities/shorts/api/type';
import ShortsIframe from './ShortsIframe';
import ShortsThumbnail from './ShortsThumbnail';
import { cn } from '@/6_shared/utils/style';

interface ShortsCardProps {
    video: Shorts;
    isHovered: boolean;
    className?: string;
}

export default function ShortsCard({ video, isHovered, className }: ShortsCardProps) {
    return (
        <div className={cn('group w-full h-full rounded-[.8rem] overflow-hidden', className)}>
            <ShortsThumbnail
                thumbnailImage={video.thumbnailImage}
                title={video.title}
                className='group-hover:hidden transition-all duration-300'
            />
            <ShortsIframe
                videoId={video.videoId}
                title={video.title}
                className='group-hover:block hidden transition-all duration-300'
                isHovered={isHovered}
            />
        </div>
    );
}
