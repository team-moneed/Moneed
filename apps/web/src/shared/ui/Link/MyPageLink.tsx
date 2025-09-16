'use client';
import { PATH } from '@/shared/config';
import IconLink from './IconLink';
import { useAuth } from '@/shared/hooks/useAuth';
import { cn } from '@/shared/utils/style';

export default function MyPageLink() {
    const { isLoggedIn } = useAuth();
    return (
        <IconLink
            className={cn('hidden sm:block w-auto', !isLoggedIn && 'hidden')}
            href={PATH.MYPAGE}
            icon='/icon/icon-profile-circle.svg'
            activeIcon='/icon/icon-profile-circle.svg'
        />
    );
}
