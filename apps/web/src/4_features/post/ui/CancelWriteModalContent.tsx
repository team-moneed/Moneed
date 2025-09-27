import Button from '@/6_shared/ui/Button/Button';
import { useModal } from '@/6_shared/hooks/useModal';
import { useRouter } from 'next/navigation';
import { MODAL_MSG } from '@/6_shared/config/message';

interface CancelWriteModalContentProps {
    type: 'write' | 'edit';
}

export default function CancelWriteModalContent({ type }: CancelWriteModalContentProps) {
    const { closeModal } = useModal();
    const router = useRouter();

    const handleContinue = () => {
        closeModal();
    };

    const handleLeave = () => {
        router.back();
        closeModal();
    };

    const title = type === 'write' ? '작성을 취소하시겠어요?' : '수정을 취소하시겠어요?';
    const message = type === 'write' ? MODAL_MSG.CANCEL_WRITE_MODAL_MSG : MODAL_MSG.CANCEL_EDIT_MODAL_MSG;

    return (
        <div
            className={
                'bg-white w-200 h-176 px-[2rem] pt-[2.8rem] pb-[2.4rem] rounded-t-[1.6rem] sm:rounded-[1.6rem] shadow-lg transform transition-transform duration-300 translate-y-0'
            }
        >
            <h2 className='text-h2 w-full text-center'>{title}</h2>
            <pre className='w-full py-[2rem] px-[2.1rem] rounded-[1.6rem] bg-moneed-shade-bg text-center text-[1.4rem] leading-[142%] mt-[2.4rem]'>
                {message}
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
