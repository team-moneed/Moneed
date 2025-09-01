'use client';

import { ReactNode } from 'react';
import { HotStock } from '@/types/stock';
import { cn } from '@/utils/style';

type StockInfoProps = {
    stock: HotStock;
    children?: ReactNode;
    className?: string;
};

const CategoryRankBox = ({ stock }: StockInfoProps) => {
    return (
        <>
            <div className='relative bg-moneed-black-3 border-moneed-gray-5 border-[.1rem] rounded-[1.6rem]'>
                <i className='absolute block aspect-square w-24 top-[-.1rem] left-[-.1rem]'>
                    <img src='/box-bg.png' alt='' className='w-full' />
                </i>
                <div className='relative flex items-end gap-[.4rem] h-16 mb-[.4rem]'>
                    <div className='flex rounded-[1.6rem] w-16 h-16 shrink-0 justify-center items-center bg-moneed-black'>
                        <div className='font-bold leading-[140%] text-[1.4rem] text-moneed-white'>{stock.rank}위</div>
                    </div>
                    <div className='flex items-center justify-between w-full px-[2.6rem]'>
                        <div className='text-[1.8rem] leading-[140%] font-semibold line-clamp-1'>{stock.sector}</div>
                        <div
                            className={cn(
                                'font-bold leading-[140%] text-[1.6rem] tracking-[0.02rem]',
                                stock.sign === '1' ? 'text-moneed-green' : 'text-moneed-red',
                            )}
                        >
                            {stock.changeRate}%
                        </div>
                    </div>
                </div>
                <div className='relative flex my-[1.2rem] mx-[1.4rem] p-4 rounded-[1.2rem] border border-solid border-moneed-gray-5 gap-[.6rem] bg-moneed-white items-center justify-center'>
                    <div className='rounded-full overflow-hidden aspect-square w-[1.6rem]'>
                        <img
                            src={stock.logoUrl ?? '/icon/icon-us.svg'}
                            alt={stock.name}
                            className='w-full h-full object-cover'
                        />
                    </div>
                    <span className='font-normal leading-[140%] text-[1.4rem] text-moneed-black'>{stock.name}</span>
                    <span className='py-[.3rem] px-[.8rem] font-normal leading-[140%] text-[1rem] text-moneed-gray-8 tracking-[0.02rem] rounded-[.6rem] border border-solid border-moneed-gray-8'>
                        {stock.symbol}
                    </span>
                </div>
            </div>
        </>
    );
};

export default CategoryRankBox;
