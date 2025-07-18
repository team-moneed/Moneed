import { ReactNode } from 'react';

type StockInfoProps = {
    infoBoxImgages?: string[] | string;
    name?: string;
    priceKRW?: string;
    priceUSD?: string;
    rate?: string;
    children?: ReactNode;
    className?: string;
    englishName?: string;
};

const StockInfoBox = ({ name, children }: StockInfoProps) => {
    return (
        <>
            <div className='flex justify-between px-[1.2rem] py-[1.8rem] border border-solid border-[var(--moneed-gray-5)] rounded-[1.6rem]'>
                <div className='flex items-center gap-[.6rem]'>
                    <div className='rounded-full overflow-hidden aspect-[1/1] w-[3.6rem]'>
                        <img src='/temp/sample3.png' alt='' className='w-full h-full object-cover' />
                    </div>
                    <div>
                        <h3 className='text-[1.4rem] font-[600] leading-[140%] text-[var(--moneed-black)]'>{name}</h3>
                        <span className='text-[1.2rem] font-[400] leading-[135%] text-[var(--moneed-gray-8)]'>
                            LLY|헬스케어
                        </span>
                    </div>
                </div>
                <div className='flex items-center gap-[.6rem]'>
                    <div className='text-[1.4rem] font-[600] leading-[140%] text-[var(--moneed-black)]'>$504.99</div>
                    <div className='text-[1.4rem] font-[600] leading-[140%] text-[var(--moneed-green)] rounded-[.8rem] bg-[var(--moneed-green-light)] p-[.4rem]'>
                        16.3%
                    </div>
                </div>
            </div>
            {children}
        </>
    );
};

export default StockInfoBox;
