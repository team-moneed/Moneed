import Image from 'next/image';
import galleryIcon from 'public/icon/icon-gallery.svg';
import { compressImage } from '@/6_shared/utils/optimizeImage';

interface ImageInputProps {
    onSelectImage: (profileImageUrl: File | string) => void;
}

export default function ImageInput({ onSelectImage }: ImageInputProps) {
    const handleUploadImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const compressedFile = await compressImage(file);
        onSelectImage(compressedFile);
    };

    return (
        <div className='relative flex justify-center items-center rounded-full bg-moneed-gray-5 p-[1.2rem] size-[4.8rem]'>
            <input
                id='profileImage'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleUploadImageFile}
                multiple={false}
                name='profileImage'
            />
            <label className='cursor-pointer size-full' htmlFor='profileImage'>
                <Image src={galleryIcon} alt='사진첩' className='w-full h-full object-cover' />
            </label>
        </div>
    );
}
