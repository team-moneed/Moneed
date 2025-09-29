import useUserStore from '@/5_entities/user/model/user.store';
import { leave } from '@/4_features/leave/api';
import TokenLocalStorage from '@/6_shared/utils/token.localstorage';
import { useMutation } from '@tanstack/react-query';
import { ProviderType } from '@moneed/auth';
import { clearTokensFromCookies } from '@/6_shared/utils/token.actions';

export const useLeave = () => {
    const clearUserInfo = useUserStore(state => state.clearUserInfo);
    const { mutateAsync: leaveMutation } = useMutation({
        mutationFn: (provider: ProviderType) => leave({ provider }),
        onSuccess: async () => {
            TokenLocalStorage.clearTokens();
            await clearTokensFromCookies();
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
