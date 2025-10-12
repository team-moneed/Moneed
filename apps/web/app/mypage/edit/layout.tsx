'use client';
import { useModal } from '@/6_shared/hooks/useModal';
import ProfileEditCancleModalContent from '@/4_features/edit-profile/ui/ProfileEditCancleModalContent';
import ArrowBackIcon from 'public/icon/icon-arrow-back.svg';
import Image from 'next/image';
import NoSSR from '@/6_shared/ui/NoSSR';

export default function MyProfileLayout({ children }: { children: React.ReactNode }) {
    const { openModal } = useModal();

    return (
        <>
            <header className='sticky top-0 z-10 bg-white flex items-center justify-between px-[4rem] pb-[1.8rem] pt-[3rem]'>
                <button onClick={() => openModal(<ProfileEditCancleModalContent />)}>
                    <Image className='cursor-pointer w-[2.4rem] h-[2.4rem]' src={ArrowBackIcon} alt='뒤로 가기' />
                </button>
                <h1 className='text-[1.6rem] font-semibold text-moneed-gray-9'>프로필 수정</h1>
                <div className='w-[2.4rem] h-[2.4rem]'></div>
            </header>
            <main className='flex-1'>
                <NoSSR>{children}</NoSSR>
            </main>
        </>
    );
}
