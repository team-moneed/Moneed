'use client';

import NotiButton from '../Button/NotiButton';
import PrevButton from '../Button/PrevButton';

export default function SubNav({ title }: { title: string }) {
    return (
        <header className='sticky top-0 z-10 bg-white sm:hidden flex items-center justify-between pb-[1.8rem] pt-[3rem] gap-[2.4rem]'>
            <div>
                <PrevButton />
            </div>
            <h1 className='hidden sm:block text-center text-[1.6rem] font-semibold text-moneed-gray-9'>{title}</h1>
            <div className='flex items-center gap-[2.4rem]'>
                <NotiButton />
            </div>
        </header>
    );
}
