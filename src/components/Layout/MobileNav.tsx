'use client';
import NavLink from '@/components/NavLink';
import MobileWritePostButton from '@/components/MobileWirtePostButton';
import { usePathname } from 'next/navigation';

const MobileNav = () => {
    const pathname = usePathname();

    const hideMobileNavPaths = ['/selectstocktype', '/myprofile', '/welcome', '/writepost', '/editpost'];
    const hideMobileWritePostButtonPaths = ['/leave'];

    if (hideMobileNavPaths.some(path => pathname.startsWith(path))) {
        return null;
    }

    return (
        <div className='flex justify-between fixed bottom-0 left-0 right-0 z-10 pt-[.6rem] pb-4 px-8 bg-moneed-gray-3 sm:hidden'>
            <NavLink href='/' icon='/icon/icon-m-nav-1.svg' activeIcon='/icon/icon-lnb-1-on.svg'>
                홈페이지
            </NavLink>
            <NavLink href='/shortform' icon='/icon/icon-m-nav-2.svg' activeIcon='/icon/icon-lnb-2-on.svg'>
                숏폼
            </NavLink>
            <NavLink href='/community' icon='/icon/icon-m-nav-3.svg' activeIcon='/icon/icon-lnb-3-on.svg'>
                커뮤니티
            </NavLink>
            <NavLink href='/mypage' icon='/icon/icon-lnb-4.svg' activeIcon='/icon/icon-lnb-4-on.svg'>
                내프로필
            </NavLink>

            {!hideMobileWritePostButtonPaths.some(path => pathname.startsWith(path)) && <MobileWritePostButton />}
        </div>
    );
};

export default MobileNav;
