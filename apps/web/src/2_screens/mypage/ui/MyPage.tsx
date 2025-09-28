'use client';
import LogoutButton from '@/4_features/user/ui/LogoutButton';
import Link from 'next/link';
import { SnackbarTrigger } from '@/6_shared/ui/Snackbar';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PATH } from '@/6_shared/config';
import RootNav from '@/6_shared/ui/layout/RootNav';
import BottomNav from '@/6_shared/ui/layout/BottomNav';
import Footer from '@/6_shared/ui/layout/Footer';
const LeaveButton = dynamic(() => import('@/4_features/user/ui/LeaveButton'), { ssr: false });
const UserInfo = dynamic(() => import('./UserInfo'), { ssr: false });
const MyStocks = dynamic(() => import('@/4_features/user/ui/MyStocks'), { ssr: false });
const MyPosts = dynamic(() => import('@/4_features/user/ui/MyPosts'), { ssr: false });
const MyComments = dynamic(() => import('@/4_features/user/ui/MyComments'), { ssr: false });

export default function Mypage() {
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason') || '';

    return (
        <>
            <RootNav />
            <BottomNav />
            <main className='flex-1'>
                <div className='px-8 max-w-512 mx-auto'>
                    <div className='lg:flex lg:gap-[2.4rem] lg:mt-[1.6rem]'>
                        <div className='space-y-[1.6rem] lg:w-[40%]'>
                            <UserInfo />
                            <section className='grid grid-cols-2 gap-x-[1.6rem] pb-[1.6rem]'>
                                <MyPosts />
                                <MyComments />
                            </section>
                        </div>
                        <div className='flex flex-col gap-[1.6rem] flex-1'>
                            <div className='p-[1.6rem] justify-center items-center rounded-[1.6rem] border border-solid bg-moneed-black-3 border-moneed-gray-5'>
                                <div className='flex mb-[1.6rem] justify-between'>
                                    <h2 className='text-[2rem] font-semibold leading-[140%]'>내가 선택한 종목</h2>
                                    <Link className='aspect-square w-[2.4rem]' href={PATH.SELECTSTOCKTYPE}>
                                        <img
                                            src='/icon/icon-addcircle.svg'
                                            alt='관심 종목 추가하기'
                                            className='w-full h-full'
                                        />
                                    </Link>
                                </div>
                                <MyStocks />
                            </div>
                            <div className='flex items-center sm:ml-auto sm:mr-0 ml-auto mr-auto gap-x-[1.6rem]'>
                                <LogoutButton />
                                <i className='w-[.2rem] h-[1.6rem] bg-moneed-gray-5'></i>
                                <LeaveButton />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <SnackbarTrigger reason={reason} />
        </>
    );
}
