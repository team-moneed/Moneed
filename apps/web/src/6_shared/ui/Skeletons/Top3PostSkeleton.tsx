export function Top3PostSkeleton() {
    return (
        <div className='flex flex-col justify-between relative border border-solid border-moneed-gray-5 rounded-[1.8rem] mb-[1.6rem] cursor-pointer py-[2.4rem] px-[3.2rem]'>
            <div className='mb-[1.2rem] sm:mb-[1.6rem]'>
                <h3 className='h-[2.8rem] mb-[.6rem] bg-gray-200 rounded-md animate-pulse w-[10rem]'></h3>
                <div className='w-full h-[1.8em] bg-gray-200 rounded-md animate-pulse mt-[.8rem]'></div>
                <div className='w-full h-[1.8rem] bg-gray-200 rounded-md animate-pulse mt-[.8rem]'></div>
                <div className='w-2/3 h-[1.8rem] bg-gray-200 rounded-md animate-pulse mt-[.8rem]'></div>
            </div>
            <div className='flex items-center gap-[.8rem]'>
                <div className='flex items-center gap-[.6rem] flex-1'>
                    <div className='w-[2.4rem] h-[2.4rem] bg-gray-200 rounded-full animate-pulse'></div>
                    <div className='w-[10rem] h-[1.6rem] bg-gray-200 rounded-md animate-pulse'></div>
                </div>
            </div>
        </div>
    );
}

export function Top3PostsSkeleton({ count }: { count: number }) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[.6rem] gap-x-[1.6rem] mt-4 md:gap-y-[1.2rem]'>
            {Array.from({ length: count }).map((_, index) => (
                <Top3PostSkeleton key={index} />
            ))}
        </div>
    );
}
