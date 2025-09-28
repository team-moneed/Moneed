import { PATH } from '@/6_shared/config';
import Link from 'next/link';

export default function LogoLink() {
    return (
        <Link href={PATH.HOME}>
            <div className='flex'>
                <div className='w-[2.8rem] h-[2.8rem] bg-moneed-black rounded-full flex items-center justify-center'>
                    <img className='w-[1.4rem] h-[1.2rem]' src='/icon/icon-logo.svg' alt='로고' />
                </div>
                <span className='font-semibold leading-[140%] text-[1.8rem] ml-[.8rem]'>moneed</span>
            </div>
        </Link>
    );
}
