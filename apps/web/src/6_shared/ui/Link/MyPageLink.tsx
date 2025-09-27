import { PATH } from '@/6_shared/config';
import IconLink from './IconLink';
import { cn } from '@/6_shared/utils/style';

export default function MyPageLink() {
    return (
        <IconLink
            className={cn('hidden sm:block w-auto')}
            href={PATH.MYPAGE}
            icon='/icon/icon-profile-circle.svg'
            activeIcon='/icon/icon-profile-circle.svg'
        />
    );
}
