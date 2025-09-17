'use client';
import { cn } from '@/shared/utils/style';
import { useModal } from '@/shared/hooks/useModal';
import LeaveModalContent from './LeaveModalContent';

export default function LeaveButton() {
    const { openModal } = useModal();

    return (
        <>
            <button
                className={cn('text-[1.4rem] font-normal leading-[145%] text-moneed-gray-7')}
                onClick={() => openModal(<LeaveModalContent />)}
            >
                탈퇴하기
            </button>
        </>
    );
}
