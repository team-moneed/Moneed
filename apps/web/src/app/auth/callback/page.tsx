'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTempCodeAuth } from '@/queries/auth.query';
import { setTokens } from '@/utils/localStorage.browser';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tempCode = searchParams.get('tempCode');

    const { data, error } = useTempCodeAuth(tempCode);

    useEffect(() => {
        if (data) {
            const { access_token, refresh_token, isNewUser } = data;

            // 토큰들을 로컬스토리지와 쿠키에 저장
            const saveTokens = async () => {
                await setTokens(access_token, refresh_token);

                // 성공 시 적절한 페이지로 리다이렉트
                if (isNewUser) {
                    router.push('/selectstocktype?url=' + encodeURIComponent('/welcome'));
                } else {
                    router.push('/');
                }
            };

            saveTokens();
        }
    }, [data, router]);

    useEffect(() => {
        if (error) {
            // 에러 시 onboarding으로 리다이렉트
            router.push('/onboarding');
        }
    }, [error, router]);

    // 임시 코드가 없으면 onboarding으로 리다이렉트
    useEffect(() => {
        if (!tempCode) {
            router.push('/onboarding');
        }
    }, [tempCode, router]);

    // 이 컴포넌트는 실제로 렌더링되지 않음 (리다이렉트만 처리)
    return null;
}
