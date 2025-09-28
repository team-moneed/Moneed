import { cn } from '@/6_shared/utils/style';
import type { Shorts } from '../api/type';
import Image from 'next/image';

export default function ShortsThumbnail({
    thumbnailImage,
    title,
    className,
}: {
    thumbnailImage: Shorts['thumbnailImage'];
    title: Shorts['title'];
    className?: string;
}) {
    return (
        <div className={cn('w-full h-full', className)}>
            <Image
                src={thumbnailImage.high.url}
                alt={title}
                className='w-full h-full object-cover'
                width={thumbnailImage.high.width}
                height={thumbnailImage.high.height}
            />
        </div>
    );
}
