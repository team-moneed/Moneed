import { LEAVE_REASON } from '@/6_shared/config/leaveReason';
import Button from '@/6_shared/ui/Button/Button';
import { useLeave } from '../query';
import useUserStore from '@/5_entities/user/model/user.store';
import { submitLeaveReason } from '../server';
import { REASON_CODES } from '@/6_shared/config';

export default function LeaveButton({ selectedReason }: { selectedReason: number }) {
    const user = useUserStore(state => state.user);
    const { leaveMutation } = useLeave();
    const handleLeave = async () => {
        if (!user) return;
        await leaveMutation(user.provider);
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
