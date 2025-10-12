import { PATH } from '@/6_shared/config';
import { MODAL_MSG } from '@/6_shared/config/message';
import { useModal } from '@/6_shared/hooks/useModal';
import Button from '@/6_shared/ui/Button/Button';
import { useRouter } from 'next/navigation';

export default function ProfileEditCancleModalContent() {
    const { closeModal } = useModal();
    const router = useRouter();

    const handleContinue = () => {
        closeModal();
    };

    const handleLeave = () => {
        closeModal();
        router.push(PATH.MYPAGE);
    };

    return (
        <div
            className={
                'bg-white w-200 px-[2rem] pt-[2.8rem] pb-[2.4rem] rounded-t-[1.6rem] sm:rounded-[1.6rem] shadow-lg transform transition-transform duration-300 translate-y-0'
            }
        >
            <pre className='w-full py-[2rem] px-[2.1rem] rounded-[1.6rem] bg-moneed-shade-bg text-center text-[1.4rem] leading-[142%]'>
                {MODAL_MSG.PROFILE_EDIT_CANCEL_MODAL_MSG}
            </pre>

            <div className='mt-[2.4rem] flex flex-col justify-center items-center w-full gap-[.8rem]'>
                <Button
                    variant='primary'
                    className='text-[1.6rem] font-bold leading-[140%] px-24 py-[1.2rem] lg:px-58 lg:py-[1.8rem] w-full'
                    onClick={handleContinue}
                >
                    이어서 하기
                </Button>
                <Button
                    variant='secondary'
                    className='text-[1.6rem] font-bold leading-[140%] px-24 py-[1.2rem] lg:px-58 lg:py-[1.8rem] w-full'
                    onClick={handleLeave}
                >
                    나가기
                </Button>
            </div>
        </div>
    );
}
