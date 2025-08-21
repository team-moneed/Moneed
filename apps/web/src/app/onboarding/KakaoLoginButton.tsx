'use client';
import { getAuthCode } from '@/apis/auth.api';
import Button from '@/components/Button';

export default function KakaoLoginButton() {
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { url } = await getAuthCode({ provider: 'kakao' });
        window.location.href = url;
    };

    return (
        <form onSubmit={handleLogin}>
            <Button
                type='submit'
                variant='primary'
                className='w-full flex items-center justify-center h-[5.6rem] gap-[1.8rem] text-[1.6rem] px-16 font-bold leading-[140%] rounded-[1.6rem] lg:w-auto'
            >
                <img src='/logo-kakao.svg' alt='kakao login button' />
                카카오로 시작하기
            </Button>
        </form>
    );
}
