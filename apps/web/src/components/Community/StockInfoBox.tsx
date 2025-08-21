'use client';

import { Stock } from '@/generated/prisma';
import { cn } from '@/utils/style';
import { ReactNode } from 'react';
import StockInfoBoxSkeleton from '../Skeletons/StockInfoBoxSkeleton';
import { useSuspenseOverseasStockPrice } from '@/queries/stock.query';
import withSuspense from '@/components/HOC/withSuspense';

type StockInfoProps = {
    infoBoxImgages?: string[] | string;
    stock: Stock;
    children?: ReactNode;
    className?: string;
};

const StockInfoBox = ({ stock, children }: StockInfoProps) => {
    const { data } = useSuspenseOverseasStockPrice({ symbol: stock.symbol });

    return (
        <>
            <div className='flex justify-between px-[1.2rem] py-[1.8rem] border border-solid border-moneed-gray-5 rounded-[1.6rem]'>
                <div className='flex items-center gap-[.6rem]'>
                    <div className='rounded-full overflow-hidden aspect-square w-[3.6rem]'>
                        <img src={stock.logoUrl} alt='stock logo' className='w-full h-full object-contain' />
                    </div>
                    <div>
                        <h3 className='text-[1.4rem] font-semibold leading-[140%] text-moneed-black'>{stock.name}</h3>
                        <span className='text-[1.2rem] font-normal leading-[135%] text-moneed-gray-8'>
                            {stock.symbol} | {stock.sector}
                        </span>
                    </div>
                </div>
                <div className='flex items-center gap-[.6rem]'>
                    <div className={cn('text-[1.4rem] font-semibold leading-[140%] text-moneed-black')}>
                        ${Number(data.output.last).toFixed(2)}
                    </div>
                    <div
                        className={cn(
                            'text-[1.4rem] font-semibold leading-[140%] rounded-[.8rem] p-[.4rem]',
                            data.output.sign === '2' && 'text-moneed-red bg-moneed-red-light',
                            data.output.sign === '3' && 'text-moneed-black bg-moneed-gray-2',
                            data.output.sign === '5' && 'text-moneed-blue bg-moneed-blue-light',
                        )}
                    >
                        {data.output.rate}%
                    </div>
                </div>
            </div>
            {children}
        </>
    );
};

export default withSuspense(StockInfoBox, <StockInfoBoxSkeleton />);
