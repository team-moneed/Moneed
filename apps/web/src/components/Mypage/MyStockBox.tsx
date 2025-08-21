'use client';
import { Stock } from '@/generated/prisma';
import { useOverseasStockPrice } from '@/queries/stock.query';
import { cn } from '@/utils/style';
import Link from 'next/link';
import { ReactNode } from 'react';

type MyStockProps = {
    stock: Stock;
    children?: ReactNode;
    className?: string;
    href: string;
};

const MyStockBox = ({ children, stock, href }: MyStockProps) => {
    const { data } = useOverseasStockPrice({ symbol: stock.symbol });
    const price =
        data &&
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(Number(data.output.last));
    const rate = data?.output.rate;
    const sign = data?.output.sign;
    return (
        <>
            <Link
                className='flex justify-between p-[.8rem] rounded-[.8rem] hover:bg-moneed-white cursor-pointer transition-colors`'
                href={href}
            >
                <div className='flex items-center gap-[.6rem] flex-1'>
                    <div className='rounded-full overflow-hidden size-[2rem] md:size-7 flex-shrink-0'>
                        <img src={stock.logoUrl} alt={stock.name} className='w-full h-full object-cover' />
                    </div>
                    <div className='rounded-[.8rem] bg-moneed-gray-4 py-[.2rem] px-[.4rem]'>
                        <span className='text-[1.2rem] font-normal leading-[135%] text-moneed-gray-9'>
                            {stock.symbol}
                        </span>
                    </div>
                    <h3 className='flex-shrink-1 text-[1.2rem] md:text-[1.4rem] font-semibold md:leading-[140%] leading-[135%] text-moneed-black line-clamp-1 '>
                        {stock.name}
                    </h3>
                </div>
                <div className='flex items-center gap-[.6rem]'>
                    <div className='text-[1.2rem] md:text-[1.4rem] font-semibold leading-[135%] md:leading-[140%] text-moneed-black'>
                        {price}
                    </div>
                    <div
                        className={cn(
                            'text-[1.2rem] md:text-[1.4rem] font-semibold leading-[135%] md:leading-[140%] rounded-[.8rem] p-[.4rem]',
                            (sign === '1' || sign === '2') && 'text-moneed-red',
                            sign === '3' && 'text-moneed-black',
                            (sign === '4' || sign === '5') && 'text-moneed-blue',
                        )}
                    >
                        {rate} %
                    </div>
                </div>
            </Link>
            {children}
        </>
    );
};

export default MyStockBox;
