export default function StockInfoBoxSkeleton() {
    return (
        <div className='flex justify-between px-[1.2rem] py-[1.8rem] border border-solid border-moneed-gray-5 rounded-[1.6rem] animate-pulse'>
            <div className='flex items-center gap-[.6rem]'>
                <div className='rounded-full w-[3.6rem] h-[3.6rem] bg-moneed-gray-5'></div>
                <div className='flex flex-col gap-[.4rem]'>
                    <div className='w-[8rem] h-[1.8rem] bg-moneed-gray-5 rounded-[.4rem]'></div>
                    <div className='w-[12rem] h-[1.4rem] bg-moneed-gray-5 rounded-[.4rem]'></div>
                </div>
            </div>
            <div className='flex items-center gap-[.6rem]'>
                <div className='w-[6rem] h-[1.8rem] bg-moneed-gray-5 rounded-[.4rem]'></div>
                <div className='w-[5rem] h-[2.6rem] bg-moneed-gray-5 rounded-[.8rem]'></div>
            </div>
        </div>
    );
}
