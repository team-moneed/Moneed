'use client';

import { logout } from '@/4_features/user/api/auth';
import { REASON_CODES } from '@/6_shared/config/snackbar';
import useSnackbarStore from '@/6_shared/store/useSnackbarStore';
import { cn } from '@/6_shared/utils/style';
import { useMutation } from '@tanstack/react-query';
import useUserStore from '@/5_entities/user/model/user.store';
import { Provider, ProviderType } from '@moneed/auth';
import { clearTokensFromCookies } from '@/6_shared/utils/token.actions';
import TokenLocalStorage from '@/6_shared/utils/token.localstorage';

export default function LogoutButton() {
    const showSnackbar = useSnackbarStore(state => state.showSnackbar);
    const clearUserInfo = useUserStore(state => state.clearUserInfo);
    const { mutate: mutateLogout, isPending } = useMutation({
        mutationFn: ({ provider }: { provider: ProviderType }) => logout({ provider }),
        onSuccess: async () => {
            TokenLocalStorage.clearTokens();
            await clearTokensFromCookies();
            clearUserInfo();
            window.location.href = `/onboarding?reason=${REASON_CODES.LOGOUT}`;
        },
        onError: () => {
            showSnackbar({
                message: '로그아웃 실패',
                variant: 'caution',
                position: 'top',
            });
        },
    });

    const handleLogout = async () => {
        const isLogout = window.confirm('로그아웃 하시겠습니까?');
        if (isLogout) {
            mutateLogout({ provider: Provider.KAKAO });
        }
    };

    return (
        <button
            className={cn(
                'text-[1.4rem] font-normal leading-[145%] text-moneed-red',
                isPending ? 'opacity-50 cursor-not-allowed' : 'hover:text-moneed-red-hover',
            )}
            onClick={handleLogout}
            disabled={isPending}
        >
            {isPending ? '로그아웃 중...' : '로그아웃'}
        </button>
    );
}
