'use client';
import LeaveReasonDropdown from '@/4_features/user/ui/LeaveReasonDropdown';
import { useState } from 'react';
import LeaveButton from '@/4_features/leave/ui/LeaveButton';

export default function LeavePage() {
    const [selectedReason, setSelectedReason] = useState(0);

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
                <LeaveButton selectedReason={selectedReason} />
            </div>
        </div>
    );
}
