'use client';
import Button from '@/components/Button';

export default function KakaoLoginButton() {
    const url = process.env.NEXT_PUBLIC_KAKAO_PROXY_SERVER + '/api/auth/kakao/login';

    return (
        <a href={url}>
            <Button
                type='submit'
                variant='primary'
                className='w-full flex items-center justify-center h-[5.6rem] gap-[1.8rem] text-[1.6rem] px-16 font-bold leading-[140%] rounded-[1.6rem] lg:w-auto'
            >
                <img src='/logo-kakao.svg' alt='kakao login button' />
                카카오로 시작하기
            </Button>
        </a>
    );
}
