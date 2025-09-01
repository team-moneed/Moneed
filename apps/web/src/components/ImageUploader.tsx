'use client';

import { compressImage, COMPRESSION_OPTIONS } from '@/utils/optimizeImage';
import { cn } from '@/utils/style';
import { forwardRef } from 'react';

interface ImageUploaderProps {
    setImage: (image: File | null) => void;
    preview?: React.ReactNode;
    setPreviewUrl: (url: string | null) => void;
    className?: string;
}

const ImageUploader = forwardRef<HTMLInputElement, ImageUploaderProps>(
    ({ setImage, preview, setPreviewUrl, className }, ref) => {
        const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                const optimizedImage = await compressImage(file, COMPRESSION_OPTIONS.THUMBNAIL);
                setImage(optimizedImage);
                setPreviewUrl(URL.createObjectURL(optimizedImage));
            }
        };

        return (
            <>
                <div className={cn('relative', className)}>
                    <input
                        id='image-uploader'
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={handleUploadFile}
                        multiple={false}
                        ref={ref}
                    />
                    <label className={cn('cursor-pointer size-full')} htmlFor='image-uploader'>
                        <img src='/icon/icon-gallery.svg' alt='gallery' className='w-full h-full object-cover' />
                    </label>
                    {preview}
                </div>
            </>
        );
    },
);

ImageUploader.displayName = 'ImageUploader';

export default ImageUploader;
