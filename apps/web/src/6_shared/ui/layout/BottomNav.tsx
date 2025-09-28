'use client';
import MobileWritePostLink from '@/6_shared/ui/Link/MobileWritePostLink';
import { PATH } from '@/6_shared/config';
import IconLink from '../Link/IconLink';

export default function BottomNav() {
    return (
        <div className='flex sm:hidden justify-between fixed bottom-0 left-0 right-0 z-10 pt-[.6rem] pb-4 px-8 bg-moneed-gray-3'>
            <IconLink
                href={PATH.HOME}
                icon='/icon/icon-m-nav-1.svg'
                activeIcon='/icon/icon-lnb-1-on.svg'
                label='홈페이지'
            />
            <IconLink
                href={PATH.SHORTFORM}
                icon='/icon/icon-m-nav-2.svg'
                activeIcon='/icon/icon-lnb-2-on.svg'
                label='숏폼'
            />
            <IconLink
                href={PATH.COMMUNITY}
                icon='/icon/icon-m-nav-3.svg'
                activeIcon='/icon/icon-lnb-3-on.svg'
                label='커뮤니티'
            />
            <IconLink
                href={PATH.MYPAGE}
                icon='/icon/icon-m-nav-4.svg'
                activeIcon='/icon/icon-lnb-4-on.svg'
                label='내프로필'
            />

            <MobileWritePostLink />
        </div>
    );
}
