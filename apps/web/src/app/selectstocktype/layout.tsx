import { Suspense } from 'react';

export default function SelectStockTypeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='px-8 max-w-512 mx-auto md:bg-[#EFEFF3] md:pt-16 absolute top-[7.6rem] bottom-0 w-full'>
            <div className='md:max-w-[59.2rem] md:rounded-[2.4rem] md:bg-white md:mx-auto md:pt-24 md:pb-16'>
                <div className='sticky top-24 bg-white md:bg-transparent pb-[3.6rem] md:static'>
                    <h2 className='text-[2.4rem] font-bold leading-[140%] text-moneed-black pt-[7.1rem] md:pt-0 md:text-center'>
                        어떤 종목을 선호하시나요?
                    </h2>
                    <p className='text-[1.4rem] font-normal leading-[140%] text-moneed-gray-7 md:text-center'>
                        *선택된 관심 종목 게시판이 보여집니다.
                    </p>
                </div>
                <Suspense>{children}</Suspense>
            </div>
        </div>
    );
}
