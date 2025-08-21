'use client';

import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const router = useRouter();
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className='px-8 max-w-320 mx-auto'>
            <div className='flex justify-center items-center mt-[6.3rem]'>
                <img src='/errorcta.svg' alt='' className='w-116' />
            </div>
            <div className='text-[2.4rem] text-moneed-black font-bold text-center mt-8 leading-[140%]'>
                {error.name}
            </div>
            <div className='text-moneed-black text-center mt-[1.2rem] font-semibold leading-[140%]'>
                {error.message}
            </div>
            <div className='flex flex-col justify-center items-center my-16 gap-[1.2rem]'>
                <Button
                    onClick={() => reset()}
                    variant='primary'
                    className='text-[1.6rem] font-bold leading-[140%] px-58 py-[1.8rem] w-2xl'
                >
                    다시 시도
                </Button>
                <Button
                    onClick={() => router.push('/')}
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
