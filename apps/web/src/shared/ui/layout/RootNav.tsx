import LogoLink from '../Link/LogoLink';
import NavLinks from '../Link/NavLinks';
import MyPageLink from '../Link/MyPageLink';
import NotiButton from '../Button/NotiButton';
import WritePostLink from '../Link/WritePostLink';
import { cn } from '@/shared/utils/style';

interface RootNavProps {
    className?: string;
}

export default function RootNav({ className }: RootNavProps) {
    return (
        <>
            <header
                className={cn(
                    'flex sticky top-0 z-10 bg-white items-center justify-between pb-[1.8rem] pt-[3rem] gap-[2.4rem]',
                    className,
                )}
            >
                <div className='flex items-center'>
                    <LogoLink />
                </div>
                <div className='hidden sm:flex items-center justify-start gap-[2.4rem] text-moneed-gray-9 text-[1.4rem] flex-1 font-semibold'>
                    <NavLinks />
                </div>
                <div className='flex items-center gap-[2.4rem] flex-shrink-0'>
                    <MyPageLink />
                    <NotiButton />
                    <WritePostLink />
                </div>
            </header>
        </>
    );
}
