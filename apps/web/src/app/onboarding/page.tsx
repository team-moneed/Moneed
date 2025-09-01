import { SnackbarTrigger } from '@/components/Snackbar';
import KakaoLoginButton from './KakaoLoginButton';

export default async function Onboarding({ searchParams }: { searchParams: Promise<{ reason: string }> }) {
    const reason = (await searchParams).reason;

    return (
        <>
            <div className="relative h-screen overflow-hidden px-[1.8rem] pt-8 bg-[url('/line-bg.png')] bg-size-[8rem_8rem] lg:bg-[url('/line-bg-pc.png')]">
                <div className='pt-[14.3rem]'>
                    <div className='relative z-2 text-[3.2rem] text-moneed-black font-bold leading-[145%]'>
                        당신의 니즈를
                        <br />
                        충족하는 투자의
                        <br />
                        시작, 머니드
                    </div>
                    <div className='z-2 absolute bottom-32 left-0 right-0 px-8 lg:sticky lg:mt-[1.6rem] lg:px-0'>
                        <KakaoLoginButton />
                    </div>
                </div>
                <div className='absolute bottom-0 right-0 h-full left-0 lg:hidden'>
                    <img src='/onboarding-arrow.svg' alt='' className='absolute bottom-0 right-0' />
                    <img src='/onboarding-square1.svg' alt='' className='absolute -right-16 bottom-140 w-[16.6rem]' />
                    <img src='/-square2.svg' alt='' className='absolute right-[6.8rem] bottom-[15.2rem] w-[14.7rem]' />
                </div>
                <div className='hidden absolute bottom-0 right-0 h-full left-0 lg:block'>
                    <img src='/onboarding-arrow-pc.svg' alt='' className='absolute top-16 right-0' />
                    <img src='/onboarding-square1.svg' alt='' className='absolute right-24 top-100 w-88' />
                    <img src='/onboarding-square2.svg' alt='' className='absolute right-[29.2rem] top-[64.6rem] w-88' />
                </div>
            </div>
            <SnackbarTrigger reason={reason} />
        </>
    );
}
