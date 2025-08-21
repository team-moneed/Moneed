'use client';

import { useRouter } from 'next/navigation';
import RandomNickname from './RandomNickname';
import { useEffect } from 'react';

export default function Welcome() {
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 2000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <>
            <div className='px-8 max-w-512 mx-auto'>
                <div className='text-[2.4rem] text-moneed-black font-bold text-center mt-36 leading-[140%]'>
                    <RandomNickname />
                    님,
                    <br />
                    회원가입을 축하합니다.
                </div>
                <div className='text-[1.4rem] text-moneed-gray-7 text-center mt-[1.6rem] font-normal leading-[140%]'>
                    2초 뒤 자동으로 페이지가 전환됩니다.
                </div>
                <div className='flex justify-center items-center mt-8'>
                    <img src='/welcome.svg' alt='' className='w-116' />
                </div>
            </div>
        </>
    );
}
