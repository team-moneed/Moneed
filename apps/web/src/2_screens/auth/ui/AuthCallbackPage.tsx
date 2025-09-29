'use client';
import { useExchangeTempCodeAndRedirect } from '@/4_features/login/hook';
import { use } from 'react';

export default function AuthCallbackPage({ searchParams }: { searchParams: Promise<{ tempCode: string }> }) {
    const { tempCode } = use(searchParams);
    useExchangeTempCodeAndRedirect(tempCode);

    // 임시코드가 없는 경우 (Suspense fallback이 표시됨)
    if (!tempCode) {
        return null;
    }

    // 이 컴포넌트는 실제로 렌더링되지 않음 (리다이렉트만 처리)
    return null;
}
