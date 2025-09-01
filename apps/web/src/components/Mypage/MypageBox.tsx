import Link from 'next/link';
import { ReactNode } from 'react';

type MypageBoxType = {
    className?: string;
    menu: string;
    count?: number;
    href: string;
    children?: ReactNode;
};

const MypageBox = ({ menu, count, href }: MypageBoxType) => {
    return (
        <>
            <Link
                className='p-[1.6rem] flex-col justify-center gap-4 rounded-[1.6rem] border border-solid border-moneed-gray-5 cursor-pointer'
                href={href}
            >
                <div className='text-[2.4rem] font-medium leading-[140%] text-moneed-black'>{count ?? 0}</div>
                <div className='text-[1.4rem] font-semibold leading-[140%] text-moneed-gray-9'>{menu ?? 0}</div>
            </Link>
        </>
    );
};

export default MypageBox;
