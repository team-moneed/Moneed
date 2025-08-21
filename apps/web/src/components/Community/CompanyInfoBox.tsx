'use client';

import { Stock } from '@/generated/prisma';

const CompanyInfoBox = ({ stock }: { stock: Stock }) => {
    return (
        <>
            <div className='px-[1.2rem] py-[1.6rem] flex items-center gap-4 bg-moneed-black-3 border border-solid border-moneed-gray-5 rounded-[1.6rem]'>
                <div className='overflow-hidden aspect-square w-[2.4rem]'>
                    <img src='/icon/icon-bulb.svg' alt='' className='w-full h-full object-cover' />
                </div>
                <div className='text-[1.4rem] font-normal leading-[140%] text-moneed-black line-clamp-2'>
                    {stock.summary}
                </div>
            </div>
        </>
    );
};

export default CompanyInfoBox;
