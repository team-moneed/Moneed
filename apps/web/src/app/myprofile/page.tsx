'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import SelectProfileImage from '@/components/Mypage/SelectProfileImage';
import { useRouter } from 'next/navigation';
import { useUser } from '@/queries/user.query';
import { checkDuplicateNickname, updateUserProfile } from '@/apis/user.api';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { REASON_CODES } from '@/constants/snackbar';
import { MyProfileSkeleton } from '@/components/Skeletons/MyProfileSkeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { useModal } from '@/context/ModalContext';

export const dynamic = 'force-dynamic';

// TODO: 프로필 사진 업로드 기능
const MyProfile = () => {
    const router = useRouter();
    const { data: user, isLoading, error } = useUser();
    const [showProfileImage, setShowProfileImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // 기본 이미지
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        watch,
        formState: { errors },
    } = useForm<{ nickname: string; profileImage: string }>({
        mode: 'onChange',
        defaultValues: {
            nickname: user?.nickname || '',
            profileImage: user?.profileImage || '',
        },
    });

    const nickname = watch('nickname');

    const { confirm } = useModal();

    const { mutate: updateUserProfileMutation, isPending } = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: () => {
            clearErrors('nickname');
            router.replace(`/mypage?reason=${REASON_CODES.PROFILE_UPDATED}`);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            if (error?.response?.status === 409) {
                setError('nickname', { message: error.response.data.message });
            } else {
                setError('nickname', { message: '닉네임 변경에 실패했습니다.' });
            }
        },
    });

    const { mutate: checkDuplicateNicknameMutation } = useMutation({
        mutationFn: checkDuplicateNickname,
        onSuccess: () => {},
        onError: (error: AxiosError<{ message: string }>) => {
            if (error?.response?.status === 409) {
                setError('nickname', { message: error.response.data.message });
            } else {
                setError('nickname', { message: '닉네임 중복 확인에 실패했습니다.' });
            }
        },
    });
    const handleSubmitNickname = handleSubmit(data => {
        clearErrors('nickname');
        updateUserProfileMutation({
            nickname: data.nickname,
            profileImage: image || selectedImage || user?.profileImage || '',
            prevProfileImageUrl: user?.profileImage || '',
        });
    });

    const handleClickEditProfile = () => {
        setShowProfileImage(prev => !prev);
    };

    const cancelChangeProfile = () => {
        confirm(
            <span>
                수정하던 내용은 저장되지 않아요.
                <br />
                다음에 수정할까요?
            </span>,
            {
                leftButtontext: '이어서 하기',
                rightButtontext: '나가기',
            },
        ).then(result => {
            if (result) {
                router.back();
            }
        });
    };

    const handleImageSelect = (img: string) => {
        setSelectedImage(img);
        setShowProfileImage(false);
    };

    const handleChangeNickname = useDebounce((nickname: string) => {
        checkDuplicateNicknameMutation({ nickname });
    }, 500);

    if (isLoading) {
        return <MyProfileSkeleton />;
    }

    if (error || !user) {
        console.error('MyProfile error:', error);
        return <div>Error loading profile</div>;
    }

    return (
        <div className='w-full max-w-[480px] px-6 mx-auto'>
            <div className='flex justify-center items-center rounded-full aspect-square w-56 mx-auto mt-24 relative'>
                <img
                    src={previewUrl || selectedImage || user?.profileImage || ''}
                    alt='Selected Profile'
                    className='w-full h-full object-cover rounded-full size-[14rem]'
                />
                <div
                    onClick={handleClickEditProfile}
                    className='absolute bottom-[0rem] right-2 bg-moneed-white border border-solid border-moneed-gray-5 rounded-full p-[0.6rem] cursor-pointer '
                >
                    <img src='/icon/icon-edit-profile.svg' alt='Edit Profile' className='w-full h-full object-cover' />
                </div>
            </div>

            {showProfileImage && (
                <SelectProfileImage onSelect={handleImageSelect} setPreviewUrl={setPreviewUrl} setImage={setImage} />
            )}

            <div>
                <div className='text-[1.6rem] font-normal leading-[140%] text-moneed-black mt-[6.9rem]'>닉네임</div>
                <input
                    {...register('nickname', {
                        required: { value: true, message: '닉네임을 입력해주세요.' },
                        minLength: { value: 2, message: '닉네임은 2-10자까지 입력하실 수 있습니다.' },
                        maxLength: { value: 10, message: '닉네임은 2-10자까지 입력하실 수 있습니다.' },
                        onChange: e => handleChangeNickname(e.target.value),
                    })}
                    value={nickname}
                    className='bg-moneed-gray-4 text-[1.6rem] rounded-[1.2rem] px-[2.4rem] py-[.8rem] h-[5.4rem] w-full'
                />
                {errors.nickname && (
                    <p className='text-[1.4rem] font-normal leading-[140%] text-moneed-red mt-[.8rem]'>
                        {errors.nickname.message}
                    </p>
                )}
                {nickname !== user?.nickname && !errors.nickname && (
                    <p className='text-[1.4rem] font-normal leading-[140%] text-moneed-green mt-[.8rem]'>
                        사용 가능한 닉네임입니다.
                    </p>
                )}
            </div>

            <div className='pt-24 flex justify-between gap-[1.6rem]'>
                <Button
                    onClick={cancelChangeProfile}
                    variant='secondary'
                    className='border border-solid border-moneed-gray-6 text-[1.6rem] font-bold leading-[140%] py-[1.8rem] w-full flex-1/3'
                >
                    취소
                </Button>
                <Button
                    onClick={handleSubmitNickname}
                    variant='primary'
                    className='text-[1.6rem] font-bold leading-[140%] py-[1.8rem] w-full flex-2/3'
                    disabled={isPending}
                >
                    {isPending ? '저장 중...' : '저장하기'}
                </Button>
            </div>
        </div>
    );
};

export default MyProfile;
