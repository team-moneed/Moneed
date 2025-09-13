'use client';

import dynamic from 'next/dynamic';

const Top5 = dynamic(() => import('./Top5'), { ssr: false });

export default function Top5Section({ id }: { id: string }) {
    const title = 'Top 5';
    const standardDate = new Date().toLocaleDateString('ko-KR', { month: 'long' });

    return (
        <section id={id} className='mt-[3.6rem]'>
            <div className='flex items-baseline gap-[.8rem] mb-[1.6rem]'>
                <h2 className='text-moneed-black text-h2 sm:text-h1'>{title}</h2>
                <span className='text-moneed-gray-7 text-[1.2rem] font-normal leading-[135%]'>{standardDate} 기준</span>
            </div>
            <Top5 />
        </section>
    );
}
