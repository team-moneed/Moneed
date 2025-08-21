import MainNews from '@/app/MainNews';
import MainShortforms from '@/app/MainShortforms';
import Top3 from '@/app/Top3';
import Link from 'next/link';
import { SnackbarTrigger } from '@/components/Snackbar';

export default async function Home({ searchParams }: { searchParams: Promise<{ reason: string }> }) {
    const reason = (await searchParams).reason;

    return (
        <>
            <div className='px-8 max-w-512 mx-auto pb-[8rem] flex flex-col gap-[1.2rem] lg:gap-[4.4rem]'>
                <section>
                    <div className='flex items-center gap-[.8rem] mb-[1.8rem] justify-between'>
                        <h2 className='text-moneed-black sm:text-h2'>HOT 숏폼</h2>
                        <button className='flex items-center gap-[.8rem] self-stretch'>
                            <Link
                                className='text-[1.4rem] font-semibold leading-[135%] text-moneed-gray-8'
                                href='/shortform'
                            >
                                더보기
                            </Link>
                            <div className='shrink-0 w-[1.8rem] h-[1.8rem]'>
                                <img src='/icon/icon-arrow-right.svg' alt='more-button' />
                            </div>
                        </button>
                    </div>
                    <MainShortforms />
                </section>

                <section className='aspect-350/106 rounded-[.8rem] overflow-hidden lg:aspect-941/151'>
                    <Link href='/smarttalk'>
                        <img src='/smarttalk_m.svg' alt='' className='w-full h-full object-cover lg:hidden' />
                        <img src='/smarttalk_pc.svg' alt='' className='hidden w-full h-full object-cover lg:block' />
                    </Link>
                </section>

                <section>
                    <div className='flex items-center gap-[.8rem] mb-[1.8rem]'>
                        <h2 className='text-moneed-black sm:text-h2'>TOP 3 종목 게시판</h2>
                        <span className='text-moneed-gray-6 text-[1.2rem] font-normal leading-[135%]'>
                            {new Date().toLocaleDateString('ko-KR', {
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                hourCycle: 'h23',
                            })}{' '}
                            기준
                        </span>
                    </div>
                    <Top3 />
                </section>

                <section>
                    <div className='flex items-center gap-[.8rem] mb-[1.8rem]'>
                        <h2 className='text-moneed-black sm:text-h2'>주요 뉴스</h2>
                    </div>
                    <MainNews />
                </section>
            </div>
            <SnackbarTrigger reason={reason} />
        </>
    );
}
