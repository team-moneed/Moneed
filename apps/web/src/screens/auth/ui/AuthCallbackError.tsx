'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const router = useRouter();

    useEffect(() => {
        // 에러를 콘솔에 로그
        console.error('Auth callback error:', error);
    }, [error]);

    const handleGoToOnboarding = () => {
        router.push('/onboarding');
    };

    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50'>
            <div className='max-w-md text-center'>
                <div className='mb-6'>
                    <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
                        <svg className='h-8 w-8 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                            />
                        </svg>
                    </div>
                    <h2 className='mb-2 text-xl font-semibold text-gray-900'>로그인 처리 중 오류가 발생했습니다</h2>
                    <p className='text-gray-600'>잠시 후 다시 시도해주시거나, 처음부터 다시 로그인해주세요.</p>
                </div>

                <div className='space-y-3'>
                    <button
                        onClick={reset}
                        className='w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    >
                        다시 시도
                    </button>
                    <button
                        onClick={handleGoToOnboarding}
                        className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    >
                        처음부터 로그인
                    </button>
                </div>
            </div>
        </div>
    );
}
