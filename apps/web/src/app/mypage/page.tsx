'use client';
import LogoutButton from '@/app/mypage/LogoutButton';
import Link from 'next/link';
import { SnackbarTrigger } from '@/components/Snackbar';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
const LeaveButton = dynamic(() => import('./LeaveButton'), { ssr: false });
const UserInfo = dynamic(() => import('./UserInfo'), { ssr: false });
const SelectedStocks = dynamic(() => import('./SelectedStocks'), { ssr: false });
const MyPosts = dynamic(() => import('./MyPosts'), { ssr: false });
const MyComments = dynamic(() => import('./MyComments'), { ssr: false });

export default function Mypage() {
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason') || '';

    return (
        <>
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
                                <Link className='aspect-square w-[2.4rem]' href={'/selectstocktype'}>
                                    <img src='/icon/icon-addcircle.svg' alt='' className='w-full h-full' />
                                </Link>
                            </div>
                            <SelectedStocks />
                        </div>
                        <div className='flex items-center sm:ml-auto sm:mr-0 ml-auto mr-auto gap-x-[1.6rem]'>
                            <LogoutButton />
                            <i className='w-[.2rem] h-[1.6rem] bg-moneed-gray-5'></i>
                            <LeaveButton />
                        </div>
                    </div>
                </div>
            </div>
            <SnackbarTrigger reason={reason} />
        </>
    );
}
