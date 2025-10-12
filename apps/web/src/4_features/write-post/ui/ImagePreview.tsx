import Image from 'next/image';

interface ImagePreviewProps {
    previewImage: string;
    handleDeleteFile: () => void;
}

export default function ImagePreview({ previewImage, handleDeleteFile }: ImagePreviewProps) {
    return (
        <div className='absolute flex gap-x-[9px] bottom-16 z-10'>
            <div className='relative size-[6rem]'>
                <Image src={previewImage} alt='썸네일 미리보기' className='object-cover w-full h-full' fill />
                <button
                    type='button'
                    onClick={() => handleDeleteFile()}
                    className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-[20px] h-[20px] flex items-center justify-center'
                >
                    x
                </button>
            </div>
        </div>
    );
}
