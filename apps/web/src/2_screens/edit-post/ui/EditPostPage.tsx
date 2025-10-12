'use client';

import { use, useEffect, Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import ImageUploader from '@/6_shared/ui/ImageUploader';
import useSnackbarStore from '@/6_shared/store/useSnackbarStore';
import { updatePost } from '@/4_features/post/api';
import { REASON_CODES } from '@/6_shared/config/snackbar';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EditPostSkeleton from '@/6_shared/ui/Skeletons/EditPostSkeleton';
import { useSuspensePost } from '@/4_features/post/query';
import { DYNAMIC_PATH } from '@/6_shared/config';
import iconSubmitPost from '/public/icon/icon-submit-post.svg';
import { compressImage, COMPRESSION_OPTIONS } from '@/6_shared/utils/optimizeImage';
import ImagePreview from '@/4_features/edit-post/ui/ImagePreview';

export interface UpdatePostField {
    title: string;
    content: string;
}

const EditPostContent = ({ postId }: { postId: string }) => {
    const router = useRouter();
    const { data: post } = useSuspensePost({ postId: Number(postId) });

    const [image, setImage] = useState<File | string | null>(post.thumbnailImage ?? null);
    const [previewImage, setPreviewImage] = useState<string | null>(post.thumbnailImage ?? null);

    const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const optimizedImage = await compressImage(file, COMPRESSION_OPTIONS.THUMBNAIL);
            setImage(optimizedImage);
            setPreviewImage(URL.createObjectURL(optimizedImage));
        }
    };

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<UpdatePostField>({
        defaultValues: {
            title: post.title,
            content: post.content,
        },
    });

    const showSnackbar = useSnackbarStore(state => state.showSnackbar);

    const content = watch('content', post.content);
    const title = watch('title', post.title);

    useEffect(() => {
        if (title.trim().length >= 50) {
            showSnackbar({
                message: '제목은 공백 포함 50자 제한입니다.',
                variant: 'normal',
                position: 'bottom',
                icon: '/icon/icon-snackbar.svg',
            });
        }

        if (content.trim().length >= 1000) {
            showSnackbar({
                message: '본문은 최대 1000자 입니다.',
                variant: 'normal',
                position: 'bottom',
                icon: '/icon/icon-snackbar.svg',
            });
        }
    }, [content, title, showSnackbar]);

    useEffect(() => {
        if (post) {
            setValue('title', post.title);
            setValue('content', post.content);
        }
    }, [post, setValue]);

    const onSubmit = async (data: UpdatePostField) => {
        const formData = { ...data };

        if (errors.title) {
            showSnackbar({
                message: '제목을 입력해주세요.',
                variant: 'normal',
                position: 'bottom',
                icon: '/icon/icon-snackbar.svg',
            });
            return;
        }

        if (errors.content) {
            showSnackbar({
                message: '내용을 입력해주세요.',
                variant: 'normal',
                position: 'bottom',
                icon: '/icon/icon-snackbar.svg',
            });
            return;
        }

        const res = await updatePost({
            postId: post.id,
            ...formData,
            thumbnailImage: image,
            prevThumbnailImageUrl: post.thumbnailImage ?? null,
        });

        if (res.status === 200) {
            router.replace(DYNAMIC_PATH.POST_DETAIL(Number(postId)) + `?reason=${REASON_CODES.POST_UPDATED}`);
        }
    };

    const handleDeleteFile = () => {
        setImage(null);
        setPreviewImage(null);
    };

    return (
        <div className='px-8 max-w-512 mx-auto h-[calc(100%-4.2rem)]'>
            <div className='flex py-[.8rem] leading-[140%] items-center gap-[.4rem]'>
                <Image src={post.author.profileImage} alt='profile' width={24} height={24} className='rounded-full' />
                <span className='text-[1.4rem] font-semibold text-moneed-black'>{post.author.nickname}</span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col h-full'>
                <input
                    {...register('title', { required: '제목을 입력해주세요.' })}
                    type='text'
                    placeholder='제목을 입력해주세요'
                    className='border-b border-moneed-gray-5 w-full py-[1.6rem] text-[1.6rem] font-normal leading-[140%] focus:outline-none placeholder:text-moneed-gray-7'
                    maxLength={50}
                />
                <textarea
                    {...register('content', { required: '의견을 입력해주세요.' })}
                    placeholder='의견을 입력해주세요'
                    className='w-full h-full flex-grow-1 py-[1.6rem] text-[1.6rem] font-normal leading-[140%] placeholder:text-moneed-gray-7 focus:outline-none resize-none'
                />
                <div className='h-[5.2rem] bg-white flex items-center justify-between transition-all duration-300 bottom-0 w-full'>
                    <ImageUploader onChange={handleUploadFile} />
                    {previewImage && <ImagePreview previewImage={previewImage} handleDeleteFile={handleDeleteFile} />}
                    <div className='text-right text-[1.4rem] text-moneed-gray-7 w-full mx-4'>
                        {content.length} / 1000자
                    </div>
                    <button
                        className='rounded-full overflow-hidden aspect-square w-[3.6rem] bg-moneed-gray-6 cursor-pointer hover:bg-moneed-brand'
                        type='submit'
                    >
                        <Image src={iconSubmitPost} alt='submit' className='w-full h-full object-cover p-[.6rem]' />
                    </button>
                </div>
            </form>
        </div>
    );
};

const EditPost = ({ params }: { params: Promise<{ postId: string }> }) => {
    const { postId } = use(params);

    return (
        <Suspense fallback={<EditPostSkeleton />}>
            <EditPostContent postId={postId} />
        </Suspense>
    );
};

export default EditPost;
