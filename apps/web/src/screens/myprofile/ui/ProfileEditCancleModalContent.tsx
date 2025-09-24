import { MODAL_MSG } from '@/shared/config/message';
import { useModal } from '@/shared/hooks/useModal';
import Button from '@/shared/ui/Button/Button';
import { useRouter } from 'next/navigation';

export default function ProfileEditCancleModalContent() {
    const { closeModal } = useModal();
    const router = useRouter();

    const handleContinue = () => {
        closeModal();
        router.back(); // 모달에서 나가기를 클릭 시 뒤로가기
    };

    const handleLeave = () => {
        closeModal(); // 모달에서 이어서 하기 클릭 시 모달 닫기
    };

    return (
        <div
            className={
                'bg-white w-200 h-176 px-[2rem] pt-[2.8rem] pb-[2.4rem] rounded-t-[1.6rem] sm:rounded-[1.6rem] shadow-lg transform transition-transform duration-300 translate-y-0'
            }
        >
            <pre className='w-full py-[2rem] px-[2.1rem] rounded-[1.6rem] bg-moneed-shade-bg text-center text-[1.4rem] leading-[142%] mt-[2.4rem]'>
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
