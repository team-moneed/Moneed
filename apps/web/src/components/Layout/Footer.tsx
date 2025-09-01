'use client';

import Logo from '@/app/onboarding/Logo';
import { cn } from '@/utils/style';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const Footer = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // 모바일 & 데스크톱 두 경우 모두 Footer를 표시하면 안되는 경로
    const hideFooterPaths = ['/selectstocktype', '/myprofile', '/writepost', '/editpost'];
    // 모바일 일때만 Footer를 표시하면 안되는 경로
    const hideFooterPathsInMobile = ['/welcome'];

    const shouldHide = hideFooterPaths.some(path => pathname.startsWith(path));
    const shouldHideOnlyMobile = hideFooterPathsInMobile.some(path => pathname.startsWith(path));

    if (shouldHide) {
        return null;
    }

    return (
        <footer
            className={cn(
                'w-full max-w-7xl mx-auto pt-[1rem] px-[2rem] pb-[3.2rem] sm:px-[4rem] sm:pb-[3.2rem] sm:pt-[1.2rem] mt-auto',
                shouldHideOnlyMobile ? 'hidden sm:block' : 'block',
            )}
        >
            <div className='flex flex-col gap-[0.8rem] w-full'>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-end'>
                    <div className='flex flex-col gap-[0.8rem]'>
                        <div>
                            <Logo />
                        </div>
                        <div>
                            <p className='text-[1.4rem]/[135%] font-normal text-moneed-gray-8 lg:text-moneed-gray-7 lg:text-center'>
                                머니드에서 제공되는 모든 정보는 투자판단의 참고자료로 원금 손실이 발생될 수 있으며, 그
                                손실은 투자자에게 귀속됩니다.
                            </p>
                        </div>
                        <div>
                            <p className='text-[1.4rem]/[140%] font-normal mb-[.5rem] text-moneed-gray-8'>
                                © Moneed All Rights Reserved
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center gap-x-[1.4rem] flex-wrap sm:gap-x-[1.8rem]'>
                        <Link href='' className='text-moneed-gray-8 text-[1.4rem]/[135%] font-semibold'>
                            이용약관
                        </Link>
                        <i className='w-[.1rem] h-4 bg-moneed-gray-8'></i>
                        <Link href='' className='text-moneed-gray-8 text-[1.4rem]/[135%] font-semibold'>
                            개인정보처리방침
                        </Link>
                    </div>
                    <div className='flex gap-[0.4rem]'>
                        <label
                            htmlFor='businessInfo'
                            className='text-[1.2rem]/[135%] font-normal text-moneed-gray-8 cursor-pointer'
                        >
                            사업자 정보
                        </label>
                        <button onClick={() => setIsOpen(!isOpen)} id='businessInfo'>
                            <img src='/icon/icon-arrow-down.svg' alt='arrow' className='w-[1.8rem] h-[1.8rem]' />
                        </button>
                    </div>
                </div>
                <div className={cn(isOpen ? 'block' : 'hidden')}>
                    <p className='text-[1.2rem]/[135%] font-normal text-moneed-gray-8 text-end'>Email help@moneed.kr</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
