import useUserStore from '@/entities/user/model/user.store';
import { leave } from '@/features/leave/api';
import { TokenUtils } from '@/shared/utils/tokenUtils';
import { useMutation } from '@tanstack/react-query';
import { ProviderType } from '@moneed/auth';

export const useLeave = () => {
    const clearUserInfo = useUserStore(state => state.clearUserInfo);
    const { mutate: leaveMutation } = useMutation({
        mutationFn: (provider: ProviderType) => leave({ provider }),
        onSuccess: async () => {
            await TokenUtils.clearTokens();
            clearUserInfo();
        },
        onError: error => {
            console.error('탈퇴 오류:', error);
            alert('탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
            throw error;
        },
    });

    return { leaveMutation };
};
