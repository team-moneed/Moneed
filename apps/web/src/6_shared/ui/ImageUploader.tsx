'use client';
import { cn } from '@/6_shared/utils/style';
import Image from 'next/image';
import galleryIcon from 'public/icon/icon-gallery.svg';

interface ImageUploaderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const ImageUploader = ({ className, ...props }: ImageUploaderProps) => {
    return (
        <>
            <div className={cn('relative', className)}>
                <input id='image-uploader' type='file' accept='image/*' className='hidden' {...props} />
                <label className={cn('cursor-pointer size-full')} htmlFor='image-uploader'>
                    <Image src={galleryIcon} alt='gallery' className='w-full h-full object-cover' />
                </label>
            </div>
        </>
    );
};

export default ImageUploader;
