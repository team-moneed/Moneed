'use client';
import NavLink from '@/shared/ui/NavLink';
import MobileWritePostButton from '@/features/post/ui/MobileWirtePostButton';
import { usePathname } from 'next/navigation';
import { PATH } from '@/shared/config';
import { REGEXP_PATH } from '../config/path';

const MobileNav = () => {
    const pathname = usePathname();

    const hideMobileNavPaths = [
        REGEXP_PATH.SELECTSTOCKTYPE,
        REGEXP_PATH.MYPROFILE,
        REGEXP_PATH.WELCOME,
        REGEXP_PATH.WRITEPOST,
        REGEXP_PATH.EDITPOST,
    ];
    const hideMobileWritePostButtonPaths = [REGEXP_PATH.LEAVE];

    if (hideMobileNavPaths.some(path => path.test(pathname))) {
        return null;
    }

    return (
        <div className='flex justify-between fixed bottom-0 left-0 right-0 z-10 pt-[.6rem] pb-4 px-8 bg-moneed-gray-3 sm:hidden'>
            <NavLink href={PATH.HOME} icon='/icon/icon-m-nav-1.svg' activeIcon='/icon/icon-lnb-1-on.svg'>
                홈페이지
            </NavLink>
            <NavLink href={PATH.SHORTFORM} icon='/icon/icon-m-nav-2.svg' activeIcon='/icon/icon-lnb-2-on.svg'>
                숏폼
            </NavLink>
            <NavLink href={PATH.COMMUNITY} icon='/icon/icon-m-nav-3.svg' activeIcon='/icon/icon-lnb-3-on.svg'>
                커뮤니티
            </NavLink>
            <NavLink href={PATH.MYPAGE} icon='/icon/icon-lnb-4.svg' activeIcon='/icon/icon-lnb-4-on.svg'>
                내프로필
            </NavLink>

            {!hideMobileWritePostButtonPaths.some(path => path.test(pathname)) && <MobileWritePostButton />}
        </div>
    );
};

export default MobileNav;
