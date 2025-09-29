'use client';

// import NotiButton from '../Button/NotiButton';
import GoBackButton from '../Button/GoBackButton';
import { cn } from '@/6_shared/utils/style';

interface SubNavProps {
    title: string;
    className?: string;
}

export default function SubNav({ title, className }: SubNavProps) {
    return (
        <header
            className={cn(
                'sticky top-0 z-10 bg-white flex items-center justify-between pb-[1.8rem] pt-[3rem] gap-[2.4rem]',
                className,
            )}
        >
            <div>
                <GoBackButton />
            </div>
            <h1 className='text-center text-[1.6rem] font-semibold text-moneed-gray-9'>{title}</h1>
            <div>{/* <NotiButton /> */}</div>
        </header>
    );
}
