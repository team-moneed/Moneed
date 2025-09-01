'use client';

import { useEffect, useRef, useState } from 'react';

type EditImageProps = {
    onUploadFiles: ((formData: FormData) => void) | (() => void);
    multiple?: boolean;
    uploadfileLength?: number;
    id: string;
    imgpreviewWidth?: number;
    imgpreviewHeight?: number;
    imgClassName?: string;
    buttonpositionClassName?: string;
    showPreview?: boolean;
    initialImages: string[];
    onDeleteImageUrlsChange: (deleteImageUrls: string[]) => void;
};

const EditImage = ({
    id,
    onUploadFiles,
    multiple,
    uploadfileLength = 5,
    imgpreviewWidth,
    imgpreviewHeight,
    imgClassName,
    buttonpositionClassName,
    showPreview = true,
    initialImages,
    onDeleteImageUrlsChange,
}: EditImageProps) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [deleteImageUrls, setDeleteImageUrls] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>(initialImages);

    useEffect(() => {
        if (initialImages.length) {
            setImages(initialImages);
        }
    }, [initialImages]);

    const ref = useRef<HTMLInputElement | null>(null);

    const handleuploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);

            const updatedFiles = [...uploadedFiles, ...newFiles];
            setUploadedFiles(updatedFiles);

            const formData = new FormData();
            updatedFiles.forEach(file => formData.append('files', file));

            onUploadFiles(formData);
        }
    };

    const handledeleteFile = (index: number, isInitialImage?: boolean) => {
        if (isInitialImage) {
            const imageToRemove = images[index];
            setImages(prevImages => {
                const updatedImages = prevImages.filter((_, i) => i !== index);
                const updatedDeleteUrls = [...deleteImageUrls, imageToRemove];
                setDeleteImageUrls(updatedDeleteUrls);
                onDeleteImageUrlsChange(updatedDeleteUrls);
                return updatedImages;
            });
        } else {
            setUploadedFiles(prevFiles => {
                const updatedFiles = prevFiles.filter((_, i) => i !== index);
                return updatedFiles;
            });
        }
    };

    return (
        <>
            <div className='relative flex flex-row gap-2 items-start'>
                <input
                    id={id}
                    type='file'
                    className='hidden'
                    onChange={handleuploadFile}
                    multiple={multiple}
                    ref={ref}
                />
                <div className='absolute flex gap-x-[9px] bottom-16 z-10'>
                    {showPreview &&
                        uploadedFiles?.map((file, index) => (
                            <div
                                key={index}
                                className='relative '
                                style={{
                                    width: `${imgpreviewWidth}px`,
                                    height: `${imgpreviewHeight}px`,
                                }}
                            >
                                {typeof file === 'string' ? (
                                    <img src={file} alt={`uploaded-${index}`} className={imgClassName} />
                                ) : (
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`uploaded-${index}`}
                                        className={imgClassName}
                                    />
                                )}
                                <button
                                    type='button'
                                    onClick={() => handledeleteFile(index)}
                                    className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-[20px] h-[20px] flex items-center justify-center'
                                >
                                    x
                                </button>
                            </div>
                        ))}
                </div>
                {uploadedFiles.length < uploadfileLength && (
                    <label
                        className={`cursor-pointer ${buttonpositionClassName} ml-auto`}
                        onClick={event => {
                            event.stopPropagation();
                            ref.current?.click();
                        }}
                    >
                        <button
                            className='rounded-full overflow-hidden aspect-square w-[3.6rem] cursor-pointer'
                            type='submit'
                        >
                            <img
                                src='/icon/icon-gallery.svg'
                                alt='gallery'
                                className='w-full h-full object-cover p-[.6rem]'
                            />
                        </button>
                    </label>
                )}
            </div>
        </>
    );
};

export default EditImage;
