'use client';

import { logout } from '@/apis/auth.api';
import { REASON_CODES } from '@/constants/snackbar';
import useSnackbarStore from '@/store/useSnackbarStore';
import { cn } from '@/utils/style';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();
    const showSnackbar = useSnackbarStore(state => state.showSnackbar);
    const { mutate: mutateLogout, isPending } = useMutation({
        mutationFn: ({ provider }: { provider: 'kakao' }) => logout({ provider }),
        onSuccess: () => {
            router.push(`/onboarding?reason=${REASON_CODES.LOGOUT}`);
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
            mutateLogout({ provider: 'kakao' });
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
