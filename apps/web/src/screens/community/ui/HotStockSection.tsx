'use client';

import dynamic from 'next/dynamic';

const HotStocks = dynamic(() => import('./HotStocks'), { ssr: false });

export default function HotStockSection({ id }: { id: string }) {
    return (
        <section>
            <div id={id} className='mt-[2.8rem]'>
                <div className='flex items-baseline gap-[.8rem] mb-[1.8rem]'>
                    <h2 className='text-[2.2rem] leading-[145%] font-bold text-moneed-black lg:text-[2.4rem] lg:leading-[140%]'>
                        지금 뜨는 종목
                    </h2>
                    <span className='text-moneed-gray-7 text-[1.2rem] font-normal leading-[135%]'>
                        {new Date().toLocaleDateString('ko-KR', {
                            month: 'long',
                            day: 'numeric',
                        })}{' '}
                        {new Date().getHours()}시 기준
                    </span>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[1.2rem] gap-x-[1.6rem] mt-4 md:gap-y-[1.2rem]'>
                <HotStocks />
            </div>
        </section>
    );
}
