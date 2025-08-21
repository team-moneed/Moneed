'use client';

import { useEffect, useState } from 'react';
import BottomModal from '@/components/BottomModal';
import ImageUploader from '@/components/ImageUploader';
import useSnackbarStore from '@/store/useSnackbarStore';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { createPost } from '@/apis/post.api';
import { REASON_CODES } from '@/constants/snackbar';
import { CreatePostField } from '@/types/fieldData';
import Button from '@/components/Button';

// TODO: 리팩토링 필요 (searchStockType 페이지로 꼭 이동해야 할까?)
const WritePost = () => {
    const searchParams = useSearchParams();
    const symbol = searchParams.get('symbol');
    const stockName = searchParams.get('stockName');
    const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CreatePostField>();
    const content = watch('content', '');
    const title = watch('title', '');

    const showSnackbar = useSnackbarStore(state => state.showSnackbar);

    useEffect(() => {
        const isModalShown = localStorage.getItem('bottomModalShown');

        if (!isModalShown && !content && !title) {
            setIsBottomModalOpen(true);
            localStorage.setItem('bottomModalShown', 'true');
        }

        return () => localStorage.removeItem('bottomModalShown');
    }, [content, title]);

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

    const movetoSearchStocktype = () => {
        router.push('/searchstocktype');
    };

    const handleDeleteFile = () => {
        setImage(null);
        setPreviewImage(null);
    };

    const handleFocus = (field: string) => {
        if (!symbol) {
            showSnackbar({
                message: '커뮤니티 종목을 먼저 선택해주세요.',
                variant: 'normal',
                position: 'top',
                icon: '/icon/icon-snackbar.svg',
            });
            return;
        }

        if (field === 'title') {
            document.getElementById('title')?.focus();
        } else if (field === 'content') {
            document.getElementById('content')?.focus();
        }
    };

    const onSubmit = async (data: CreatePostField) => {
        if (!symbol) {
            showSnackbar({
                message: '커뮤니티 종목을 선택해주세요.',
                variant: 'normal',
                position: 'bottom',
                icon: '/icon/icon-snackbar.svg',
            });
            return;
        }

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

        const res = await createPost({
            ...data,
            symbol,
            thumbnailImage: image,
        });

        if (res.status === 201) {
            const { post } = res.data;
            router.replace(`/community/${post.stock.symbol}/posts/${post.id}?reason=${REASON_CODES.POST_CREATED}`);
        }
    };

    return (
        <div className='px-8 max-w-512 mx-auto flex flex-col h-full pb-[8rem]'>
            <div className='flex items-center justify-between gap-[.6rem] mt-4'>
                <button
                    className='bg-moneed-shade-bg py-[1.2rem] px-[1.6rem] rounded-[.8rem] flex items-center gap-[0.6rem]'
                    onClick={movetoSearchStocktype}
                >
                    <span
                        className={`text-[1.4rem] font-normal ${symbol ? 'text-moneed-black' : 'text-moneed-gray-7'}`}
                    >
                        {stockName || '글을 쓸 커뮤니티 종목을 선택해주세요.'}
                    </span>
                    <div className='overflow-hidden aspect-square w-[1.2rem]'>
                        <img src='/icon/icon-arrow-down.svg' alt='' className='w-full h-full object-cover' />
                    </div>
                </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col flex-1 w-full'>
                <input
                    {...register('title', { required: true })}
                    placeholder='제목을 입력해주세요'
                    className='border-b border-moneed-gray-5 w-full py-[1.6rem] text-[1.6rem] font-normal leading-[140%] focus:outline-none placeholder:text-moneed-gray-7'
                    maxLength={50}
                    onFocus={() => handleFocus('title')}
                />
                <textarea
                    {...register('content', { required: true })}
                    placeholder='의견을 입력해주세요'
                    className='w-full flex-1 py-[1.6rem] text-[1.6rem] font-normal leading-[140%] placeholder:text-moneed-gray-7 focus:outline-none resize-none'
                    maxLength={1000}
                    onFocus={() => handleFocus('content')}
                />
                <div
                    className={`h-[5.2rem] bg-white flex items-center justify-between transition-all duration-300 bottom-0 w-full`}
                >
                    <ImageUploader
                        setImage={setImage}
                        setPreviewUrl={setPreviewImage}
                        preview={
                            <div className='absolute flex gap-x-[9px] bottom-16 z-10'>
                                {previewImage && (
                                    <div className='relative size-[6rem]'>
                                        <img
                                            src={previewImage}
                                            alt='thumbnail-preview'
                                            className='object-cover w-full h-full'
                                        />
                                        <button
                                            type='button'
                                            onClick={() => handleDeleteFile()}
                                            className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-[20px] h-[20px] flex items-center justify-center'
                                        >
                                            x
                                        </button>
                                    </div>
                                )}
                            </div>
                        }
                    />
                    <div className='text-right text-[1.4rem] text-moneed-gray-7 w-full mx-4'>
                        {content.length} / 1000자
                    </div>
                    <button
                        className='rounded-full overflow-hidden aspect-square w-[3.6rem] bg-moneed-gray-6 cursor-pointer hover:bg-moneed-brand'
                        type='submit'
                    >
                        <img
                            src='/icon/icon-submit-post.svg'
                            alt='submit'
                            className='w-full h-full object-cover p-[.6rem]'
                        />
                    </button>
                </div>
            </form>
            {isBottomModalOpen && (
                <BottomModal
                    imageSrc='/post-warning.svg'
                    title={
                        <h2 className='text-[2.4rem] text-center text-moneed-black font-bold leading-[140%]'>
                            이런 의견은 피해주세요
                        </h2>
                    }
                    description={
                        <div className='text-[1.6rem] text-center text-moneed-black font-semibold leading-[140%] mt-[3.8rem]'>
                            스팸홍보/도배글
                            <br />
                            욕설/음란물,
                            <br />
                            불법 투자 조장,
                            <br />
                            청소년에게 유해한 내용
                        </div>
                    }
                    buttons={
                        <Button
                            variant='primary'
                            className='text-[1.6rem] font-bold leading-[140%] py-[1.8rem] w-full'
                            onClick={() => setIsBottomModalOpen(false)}
                        >
                            확인
                        </Button>
                    }
                    onClose={() => setIsBottomModalOpen(false)}
                />
            )}
        </div>
    );
};

export default WritePost;
