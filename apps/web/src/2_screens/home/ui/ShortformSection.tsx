import VideoCarousel from '@/2_screens/home/ui/VideoCarousel';
import { PATH } from '@/6_shared/config';
import Link from 'next/link';
import Image from 'next/image';
import iconArrowRight from '/public/icon/icon-arrow-right.svg';

export default function ShortformSection() {
    const shortformCount = 10;
    return (
        <>
            <section>
                <div className='flex items-center gap-[.8rem] mb-[1.8rem] justify-between'>
                    <h2 className='text-moneed-black sm:text-h2'>HOT 숏폼</h2>
                    <button className='flex items-center gap-[.8rem] self-stretch'>
                        <Link
                            className='text-[1.4rem] font-semibold leading-[135%] text-moneed-gray-8'
                            href={PATH.SHORTFORM}
                        >
                            더보기
                        </Link>
                        <div className='shrink-0 w-[1.8rem] h-[1.8rem]'>
                            <Image src={iconArrowRight} alt='more-button' />
                        </div>
                    </button>
                </div>
                <div className='mt-4'>
                    <VideoCarousel count={shortformCount} />
                </div>
            </section>
        </>
    );
}
