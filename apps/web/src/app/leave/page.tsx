'use client';
import { leave } from '@/apis/auth.api';
import { REASON_CODES } from '@/constants/snackbar';
import Button from '@/shared/ui/Button';
import { useMutation } from '@tanstack/react-query';
import LeaveReasonDropdown from './LeaveReasonDropdown';
import { useState } from 'react';
import { LEAVE_REASON } from '@/constants/leaveReason';
import { clearTokens } from '@/utils/localStorage.browser';

export default function Leave() {
    const [selectedReason, setSelectedReason] = useState(0);

    const { mutate: leaveKakao } = useMutation({
        mutationFn: (reason: string) => leave({ provider: 'kakao', reason }),
        onSuccess: async () => {
            await clearTokens();
            window.location.href = `/?reason=${REASON_CODES.LEAVE}`;
        },
        onError: error => {
            console.error('탈퇴 오류:', error);
            alert('탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        },
    });

    return (
        <div className='flex flex-col gap-[30rem] items-center justify-between h-full w-full sm:pt-[10rem] pt-[1rem] sm:pb-[4.8rem] pb-[2.4rem]'>
            <div className='flex flex-col items-start w-full'>
                <div className='sm:flex hidden w-full items-center justify-start'>
                    <div className='bg-moneed-black rounded-full size-[6rem] flex items-center justify-center'>
                        <img src='/icon/icon-logo.svg' alt='logo' className='size-[3.6rem]' />
                    </div>
                </div>
                <h1 className='text-[2.4rem] font-bold leading-[140%] sm:mt-[2rem]'>우리, 여기서 끝인가요...?</h1>
                <p className='text-md leading-[145%] mt-[1.2rem]'>
                    함께해주셔서 감사했어요. <br />
                    혹시 탈퇴 이유를 들려주실 수 있을까요?
                </p>
                <LeaveReasonDropdown setSelectedReason={setSelectedReason} selectedReason={selectedReason} />
            </div>
            <div className='w-full'>
                <p className='w-full text-center text-[1.2rem] leading-[135%] text-moneed-gray-8'>
                    지금 탈퇴하면, 모든 기록이 사라져요
                </p>
                <Button
                    variant='danger'
                    disabled={selectedReason === 0}
                    className='text-[1.6rem] font-bold leading-[140%] py-[1.8rem] w-full mt-[1rem]'
                    onClick={() => leaveKakao(LEAVE_REASON[selectedReason].reason || '')}
                >
                    Moneed 회원 탈퇴하기
                </Button>
            </div>
        </div>
    );
}
