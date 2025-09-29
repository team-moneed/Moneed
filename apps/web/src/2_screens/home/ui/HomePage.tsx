import Top3 from '@/2_screens/home/ui/Top3';
import Link from 'next/link';
import { SnackbarTrigger } from '@/6_shared/ui/Snackbar';
import { PATH } from '@/6_shared/config';
import Footer from '@/6_shared/ui/layout/Footer';
import RootNav from '@/6_shared/ui/layout/RootNav';
import BottomNav from '@/6_shared/ui/layout/BottomNav';
import Image from 'next/image';
import smarttalkMobile from '/public/images/smarttalk_m.svg';
import smarttalkPc from '/public/images/smarttalk_pc.svg';
import ShortformSection from './ShortformSection';

export default async function Home({ searchParams }: { searchParams: Promise<{ reason: string }> }) {
    const reason = (await searchParams).reason;

    return (
        <>
            <RootNav />
            <BottomNav />
            <div className='pb-[8rem] flex flex-col gap-[1.2rem] lg:gap-[4.4rem]'>
                <ShortformSection />

                <section className='aspect-350/106 rounded-[.8rem] overflow-hidden lg:aspect-941/151'>
                    <Link href={PATH.SMARTTALK}>
                        <Image
                            src={smarttalkMobile}
                            alt='smarttalk-mobile-banner'
                            className='w-full h-full object-cover lg:hidden'
                        />
                        <Image
                            src={smarttalkPc}
                            alt='smarttalk-pc-banner'
                            className='hidden w-full h-full object-cover lg:block'
                        />
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

                {/* <section>
                    <div className='flex items-center gap-[.8rem] mb-[1.8rem]'>
                        <h2 className='text-moneed-black sm:text-h2'>주요 뉴스</h2>
                    </div>
                    <MainNews />
                </section> */}
            </div>
            <Footer />
            <SnackbarTrigger reason={reason} />
        </>
    );
}
