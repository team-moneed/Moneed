'use client';
import { useModal } from '@/shared/hooks/useModal';
import ProfileEditCancleModalContent from '@/screens/myprofile/ui/ProfileEditCancleModalContent';

export default function MyProfileLayout({ children }: { children: React.ReactNode }) {
    const { openModal } = useModal();

    return (
        <>
            <header className='sticky top-0 z-10 bg-white flex lg:hidden items-center justify-between px-[4rem] pb-[1.8rem] pt-[3rem]'>
                <button onClick={() => openModal(<ProfileEditCancleModalContent />)}>
                    <img
                        className='cursor-pointer w-[2.4rem] h-[2.4rem]'
                        src='/icon/icon-arrow-back.svg'
                        alt='뒤로 가기'
                    />
                </button>
                <h1 className='text-[1.6rem] font-semibold text-moneed-gray-9'>프로필 수정</h1>
                <div className='w-[2.4rem] h-[2.4rem]'></div>
            </header>
            <main className='flex-1'>{children}</main>
        </>
    );
}
