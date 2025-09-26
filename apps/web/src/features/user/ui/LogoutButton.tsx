'use client';

import { logout } from '@/features/user/api/auth';
import { REASON_CODES } from '@/shared/config/snackbar';
import useSnackbarStore from '@/shared/store/useSnackbarStore';
import { TokenUtils } from '@/shared/utils/tokenUtils';
import { cn } from '@/shared/utils/style';
import { useMutation } from '@tanstack/react-query';
import useUserStore from '@/entities/user/model/user.store';
import { Provider, ProviderType } from '@moneed/auth';

export default function LogoutButton() {
    const showSnackbar = useSnackbarStore(state => state.showSnackbar);
    const clearUserInfo = useUserStore(state => state.clearUserInfo);
    const { mutate: mutateLogout, isPending } = useMutation({
        mutationFn: ({ provider }: { provider: ProviderType }) => logout({ provider }),
        onSuccess: async () => {
            await TokenUtils.clearTokens();
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
