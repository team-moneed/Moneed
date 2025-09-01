'use client';

import Button from '@/components/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface ErrorInfo {
    title: string;
    message: string;
    action?: string;
}

const ERROR_MESSAGES: Record<string, ErrorInfo> = {
    access_denied: {
        title: '로그인 취소',
        message: '카카오 로그인이 취소되었습니다.',
        action: '다시 시도해주세요.',
    },
    invalid_request: {
        title: '잘못된 요청',
        message: '로그인 요청이 올바르지 않습니다.',
        action: '다시 시도해주세요.',
    },
    missing_code: {
        title: '인증 코드 누락',
        message: '카카오로부터 인증 코드를 받지 못했습니다.',
        action: '다시 로그인해주세요.',
    },
    invalid_state: {
        title: '보안 검증 실패',
        message: '요청의 보안 검증에 실패했습니다.',
        action: '다시 로그인해주세요.',
    },
    token_request_failed: {
        title: '토큰 요청 실패',
        message: '카카오 서버와의 통신에 실패했습니다.',
        action: '잠시 후 다시 시도해주세요.',
    },
    user_info_failed: {
        title: '사용자 정보 조회 실패',
        message: '사용자 정보를 가져오는데 실패했습니다.',
        action: '다시 로그인해주세요.',
    },
    internal_error: {
        title: '서버 오류',
        message: '서버에서 오류가 발생했습니다.',
        action: '잠시 후 다시 시도해주세요.',
    },
    invalid_callback: {
        title: '잘못된 콜백',
        message: '올바르지 않은 OAuth 콜백입니다.',
        action: '처음부터 다시 로그인해주세요.',
    },
};

function AuthError() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [errorInfo, setErrorInfo] = useState<ErrorInfo>({
        title: '알 수 없는 오류',
        message: '알 수 없는 오류가 발생했습니다.',
        action: '다시 시도해주세요.',
    });

    useEffect(() => {
        const error = searchParams.get('error');
        const description = searchParams.get('description');

        if (error && ERROR_MESSAGES[error]) {
            setErrorInfo(ERROR_MESSAGES[error]);
        } else if (description) {
            setErrorInfo({
                title: '로그인 오류',
                message: description,
                action: '다시 시도해주세요.',
            });
        }
    }, [searchParams]);

    const handleRetry = () => {
        // 로그인 페이지로 리다이렉트
        router.push('/onboarding');
    };

    const handleHome = () => {
        router.push('/');
    };

    return (
        <div className='px-8 max-w-512 mx-auto'>
            <div className='flex justify-center items-center mt-[6.3rem]'>
                <img src='/errorcta.svg' alt='' className='w-116' />
            </div>
            <div className='text-[2.4rem] text-moneed-black font-bold text-center mt-8 leading-[140%]'>
                {errorInfo.title}
            </div>
            <div className='text-moneed-black text-center mt-[1.2rem] font-semibold leading-[140%]'>
                {errorInfo.message}
            </div>
            <div className='text-moneed-black text-center mt-[1.2rem] font-semibold leading-[140%]'>
                {errorInfo.action}
            </div>
            <div className='flex flex-col justify-center items-center my-16 gap-[1.2rem]'>
                <Button
                    onClick={handleRetry}
                    variant='primary'
                    className='text-[1.6rem] font-bold leading-[140%] px-58 py-[1.8rem] w-2xl'
                >
                    다시 시도
                </Button>
                <Button
                    onClick={handleHome}
                    variant='primary'
                    className='text-[1.6rem] font-bold leading-[140%] px-58 py-[1.8rem] w-2xl'
                >
                    홈으로 돌아가기
                </Button>
            </div>
            <div className='text-moneed-gray-7 font-normal text-center text-[1.4rem] leading-[140%]'>
                오류상황 메일신고: help@moneed.kr
            </div>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={<div>로딩중...</div>}>
            <AuthError />
        </Suspense>
    );
}
