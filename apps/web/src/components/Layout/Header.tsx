'use client';

import { usePathname, useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Link from 'next/link';
import Logo from '@/app/onboarding/Logo';
import NavLink from '@/components/NavLink';

export const DesktopHeader = () => {
    const router = useRouter();

    const movetowritepost = () => {
        router.push('/writepost');
    };

    return (
        <header className='sticky top-0 z-10 hidden bg-white lg:flex items-center justify-between pb-[1.8rem] pt-[3rem]'>
            <Link href='/'>
                <div className='flex'>
                    <div className='w-[2.8rem] h-[2.8rem] bg-moneed-black rounded-full flex items-center justify-center'>
                        <img className='w-[1.4rem] h-[1.2rem]' src='/icon/icon-logo.svg' alt='' />
                    </div>
                    <span className='font-semibold leading-[140%] text-[1.8rem] ml-[.8rem]'>moneed</span>
                </div>
            </Link>
            <NavLink href='/shortform'>
                <span className='hidden lg:block lg:text-[1.4rem] font-semibold ml-[2.6rem]'>숏폼</span>
            </NavLink>
            <NavLink href='/community'>
                <span className='hidden lg:block lg:text-[1.4rem] font-semibold w-[8.4rem] ml-[2.4rem]'>커뮤니티</span>
            </NavLink>
            <div className='flex items-center gap-[2.4rem] ml-auto'>
                <NavLink
                    href='/mypage'
                    icon='/icon/icon-profile-circle.svg'
                    activeIcon='/icon/icon-profile-circle.svg'
                />
                <img className='w-[2.4rem] h-[2.4rem]' src='/icon/icon-alarm.svg' alt='' />
                <Button
                    onClick={movetowritepost}
                    className='hidden lg:flex gap-4 px-[2.4rem] py-[.8rem] items-center'
                    variant='brand'
                >
                    <img className='w-[1.8rem] h-[1.8rem]' src='/icon/icon-edit.svg' alt='' />
                    <span className='font-semibold leading-[135%] text-[1.4rem]'>포스팅</span>
                </Button>
            </div>
        </header>
    );
};

export const MobileHeader = () => {
    return (
        <header className='sticky top-0 z-10 flex bg-white lg:hidden items-center justify-between pb-[1.8rem] pt-[3rem] px-[1.8rem] lg:px-0'>
            <Link href='/'>
                <div className='flex'>
                    <div className='w-[2.8rem] h-[2.8rem] bg-moneed-black rounded-full flex items-center justify-center'>
                        <img className='w-[1.4rem] h-[1.2rem]' src='/icon/icon-logo.svg' alt='back-button' />
                    </div>
                    <span className='font-semibold leading-[140%] text-[1.8rem] ml-[.8rem]'>moneed</span>
                </div>
            </Link>
            <div className='flex items-center gap-[2.4rem] ml-auto'>
                <img className='w-[2.4rem] h-[2.4rem]' src='/icon/icon-alarm.svg' alt='notification' />
            </div>
        </header>
    );
};

export const BackNotificationHeader = ({ title }: { title: string }) => {
    const router = useRouter();

    const handleBackButtonClick = () => {
        router.back();
    };
    return (
        <header className='sticky top-0 z-10 bg-white flex items-center justify-between px-[4rem] pb-[1.8rem] pt-[3rem]'>
            <button onClick={handleBackButtonClick}>
                <img className='cursor-pointer w-[2.4rem] h-[2.4rem]' src='/icon/icon-arrow-back.svg' alt='' />
            </button>
            <h1 className='text-[1.6rem] font-semibold text-moneed-gray-9'>{title}</h1>
            <Link href='/notification'>
                <img className='w-[2.4rem] h-[2.4rem]' src='/icon/icon-alarm.svg' alt='notification' />
            </Link>
        </header>
    );
};

const MenuHeader = () => {
    const router = useRouter();
    const pathname = usePathname();

    // 뒤로가기 버튼 클릭 시 동작
    const handleBackButtonClick = () => {
        router.back();
    };

    const getHeaderTitle = (pathname: string) => {
        switch (pathname) {
            case '/leave':
                return '탈퇴하기';
            case '/searchstocktype':
                return '게시판 선택';
            case '/community':
                return '커뮤니티';
            case '/mypost':
                return '내가 작성한 게시글';
            case '/mycomment':
                return '내가 작성한 댓글';
            default:
                return 'moneed';
        }
    };

    const ExitButton = () => {
        return (
            <img
                className='w-[2.4rem] h-[2.4rem] cursor-pointer'
                onClick={() => router.push('/')}
                src='/icon/icon-exit.svg'
                alt=''
            />
        );
    };

    const AlarmButton = () => {
        return <img className='w-[2.4rem] h-[2.4rem]' src='/icon/icon-alarm.svg' alt='' />;
    };

    const getHeaderRightButton = (pathname: string) => {
        switch (pathname) {
            case '/leave':
                return <ExitButton />;
            default:
                return <AlarmButton />;
        }
    };

    return (
        <header className='sticky top-0 z-10 bg-white flex items-center justify-between px-[4rem] pb-[1.8rem] pt-[3rem]'>
            <img
                className='cursor-pointer w-[2.4rem] h-[2.4rem]'
                onClick={handleBackButtonClick}
                src='/icon/icon-arrow-back.svg'
                alt=''
            />
            <h1 className='text-[1.6rem] font-semibold text-moneed-gray-9'>{getHeaderTitle(pathname)}</h1>
            {getHeaderRightButton(pathname)}
        </header>
    );
};

const NoMenuHeader = () => {
    return (
        <header className='sticky top-0 z-10 bg-white flex items-center justify-between md:px-[4rem] md:pb-[1.8rem] md:pt-[3rem] px-[1.8rem] pt-[2rem] pb-[1.2rem]'>
            <Logo />
        </header>
    );
};

const Header = () => {
    const menuHeaderPaths = ['/mycomment', '/mypost', '/searchstocktype', '/leave'];

    const noMenuHeaderPaths = ['/onboarding', '/selectstocktype'];
    const commonHeaderPaths = ['/'];

    const pathname = usePathname();

    if (noMenuHeaderPaths.some(path => pathname.startsWith(path))) {
        return <NoMenuHeader />;
    } else if (menuHeaderPaths.some(path => pathname.startsWith(path))) {
        return <MenuHeader />;
    } else if (commonHeaderPaths.some(path => pathname === path)) {
        return <DesktopHeader />;
    }
};

export default Header;
