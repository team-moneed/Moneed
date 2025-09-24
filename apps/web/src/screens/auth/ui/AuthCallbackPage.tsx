'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTempCodeAuth } from '@/features/user/query';
import { TokenUtils } from '@/shared/utils/tokenUtils';
import { PATH } from '@/shared/config';
import useUserStore from '@/entities/user/model/user.store';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tempCode = searchParams?.get('tempCode');
    const setUser = useUserStore(state => state.setUser);

    const { data, error, isLoading } = useTempCodeAuth(tempCode || '');

    useEffect(() => {
        if (data) {
            const { access_token, refresh_token, isNewUser, payload } = data;

            // 토큰들을 로컬스토리지와 쿠키에 저장
            const saveTokens = async () => {
                try {
                    await TokenUtils.setTokens(access_token, refresh_token);
                    setUser(payload);

                    // 성공 시 적절한 페이지로 리다이렉트
                    if (isNewUser) {
                        router.push(`${PATH.SELECTSTOCKTYPE}?url=${encodeURIComponent(PATH.WELCOME)}`);
                    } else {
                        router.push(PATH.HOME);
                    }
                } catch (error) {
                    console.error('Failed to save tokens:', error);
                    // 토큰 저장 실패 시 onboarding으로 리다이렉트
                    router.push(PATH.ONBOARDING);
                }
            };

            saveTokens();
        }
    }, [data, router, setUser]);

    if (error) {
        // 에러 시 onboarding으로 리다이렉트
        console.error('Auth callback error:', error);
        router.push(PATH.ONBOARDING);
    }

    if (!tempCode) {
        router.push(PATH.ONBOARDING);
    }

    // 로딩 중이거나 처리 중일 때는 null 반환 (Suspense fallback이 표시됨)
    if (isLoading || !tempCode) {
        return null;
    }

    // 이 컴포넌트는 실제로 렌더링되지 않음 (리다이렉트만 처리)
    return null;
}
