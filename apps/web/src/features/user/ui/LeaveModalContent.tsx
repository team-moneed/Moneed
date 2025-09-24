import Button from '@/shared/ui/Button/Button';
import { PATH } from '@/shared/config';
import { useRouter } from 'next/navigation';
import { useModal } from '@/shared/hooks/useModal';
import useUserStore from '@/entities/user/model/user.store';
import { MODAL_MSG } from '@/shared/config/message';

export default function LeaveModalContent() {
    const router = useRouter();
    const { closeModal } = useModal();
    const user = useUserStore(state => state.user);

    const handleLeave = () => {
        router.push(PATH.LEAVE);
        closeModal();
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <div
            className={
                'bg-white w-200 h-176 px-[2rem] pt-[2.8rem] pb-[2.4rem] rounded-t-[1.6rem] sm:rounded-[1.6rem] shadow-lg transform transition-transform duration-300 translate-y-0'
            }
        >
            <h2 className='text-h2 w-full text-center'>
                이대로 떠나시겠어요,
                <br />
                <span className='text-moneed-brand'>{user?.nickname}</span>님?
            </h2>
            <pre className='w-full py-[2rem] px-[2.1rem] rounded-[1.6rem] bg-moneed-shade-bg text-center text-[1.4rem] leading-[142%] mt-[2.4rem]'>
                {MODAL_MSG.LEAVE_MODAL_MSG}
            </pre>

            <div className='mt-[2.4rem] flex flex-col justify-center items-center w-full gap-[.8rem]'>
                <Button
                    variant='primary'
                    className='text-[1.6rem] font-bold leading-[140%] px-24 py-[1.2rem] lg:px-58 lg:py-[1.8rem] w-full'
                    onClick={handleCancel}
                >
                    계정을 계속 쓸래요
                </Button>
                <Button
                    variant='secondary'
                    className='text-[1.6rem] font-bold leading-[140%] px-24 py-[1.2rem] lg:px-58 lg:py-[1.8rem] w-full'
                    onClick={handleLeave}
                >
                    탈퇴하고 싶어요
                </Button>
            </div>
        </div>
    );
}
