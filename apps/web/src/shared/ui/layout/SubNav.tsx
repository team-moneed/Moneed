'use client';

import NotiButton from '../Button/NotiButton';
import PrevButton from '../Button/PrevButton';

export default function SubNavBar({ title }: { title: string }) {
    return (
        <header className='sticky top-0 z-10 bg-white sm:hidden flex items-center justify-between pb-[1.8rem] pt-[3rem] gap-[2.4rem]'>
            <div>
                <PrevButton />
            </div>
            <div className='hidden sm:flex items-center gap-[2.4rem]'>{title}</div>
            <div className='flex items-center gap-[2.4rem]'>
                <NotiButton />
            </div>
        </header>
    );
}
