'use client';

import dynamic from 'next/dynamic';

const HotPosts = dynamic(() => import('./HotPosts'), { ssr: false });

export default function HotPostsSection({ id }: { id: string }) {
    const title = '인기 급상승 게시글';

    return (
        <section id={id} className='mt-[2.8rem]'>
            <div className='flex items-baseline gap-[.8rem] mb-[1.8rem]'>
                <h2 className='text-[2.2rem] leading-[145%] font-bold text-moneed-black lg:text-[2.4rem] lg:leading-[140%]'>
                    {title}
                </h2>
            </div>
            <HotPosts />
        </section>
    );
}
