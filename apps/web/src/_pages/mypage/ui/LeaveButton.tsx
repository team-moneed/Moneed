'use client';
import { cn } from '@/shared/utils/style';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BottomModal from '@/components/BottomModal';
import Button from '@/shared/ui/Button';
import { useSuspenseUser } from '@/features/user/query';
import withSuspense from '@/shared/ui/withSuspense';
import { PATH } from '@/shared/config';

function LeaveButton() {
    const router = useRouter();
    const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
    const { data: user } = useSuspenseUser();

    const handleLeave = () => {
        setIsBottomModalOpen(false);
        router.push(PATH.LEAVE);
    };

    const handleCancel = () => {
        setIsBottomModalOpen(false);
    };

    return (
        <>
            <button
                className={cn('text-[1.4rem] font-normal leading-[145%] text-moneed-gray-7')}
                onClick={() => setIsBottomModalOpen(true)}
            >
                탈퇴하기
            </button>
            {isBottomModalOpen && (
                <BottomModal
                    title={
                        <h2 className='text-h2 w-full text-center'>
                            이대로 떠나시겠어요,
                            <br />
                            <span className='text-moneed-brand'>{user?.nickname}</span>님?
                        </h2>
                    }
                    description={
                        // prettier-ignore
                        <p className='w-full py-[2rem] px-[2.1rem] rounded-[1.6rem] bg-moneed-shade-bg text-center text-[1.4rem] leading-[142%] mt-[2.4rem]'>
                            지금 탈퇴하시면, <br/>
                            그동안 함께한 기록들이 모두 사라져요. <br/>
                            모아두신 종목 정보도와 댓글, 좋아요까지도요. <br/> 
                            요즘 미국장도 활발해지고 있어요! <br />
                            조금 더 함께해보시는 건 어떠세요?
                        </p>
                    }
                    buttons={
                        <>
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
                        </>
                    }
                    onClose={() => setIsBottomModalOpen(false)}
                />
            )}
        </>
    );
}

export default withSuspense(
    LeaveButton,
    <div className='h-[1.4rem] w-[5.6rem] rounded-[.8rem] bg-moneed-gray-5 animate-pulse' />,
);
