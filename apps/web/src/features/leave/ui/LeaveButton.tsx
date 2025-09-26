import { LEAVE_REASON } from '@/shared/config/leaveReason';
import Button from '@/shared/ui/Button/Button';
import { useLeave } from '../query';
import { useShallow } from 'zustand/react/shallow';
import useUserStore from '@/entities/user/model/user.store';
import { submitLeaveReason } from '../server';
import { REASON_CODES } from '@/shared/config';

export default function LeaveButton({ selectedReason }: { selectedReason: number }) {
    const provider = useUserStore(useShallow(state => state.provider));
    const { leaveMutation } = useLeave();
    const handleLeave = async () => {
        if (!provider) return;
        await leaveMutation(provider);
        await submitLeaveReason(LEAVE_REASON[selectedReason].reason || '');
        window.location.href = `/?reason=${REASON_CODES.LEAVE}`;
    };

    return (
        <Button
            variant='danger'
            disabled={selectedReason === 0}
            className='text-[1.6rem] font-bold leading-[140%] py-[1.8rem] w-full mt-[1rem]'
            onClick={handleLeave}
        >
            Moneed 회원 탈퇴하기
        </Button>
    );
}
