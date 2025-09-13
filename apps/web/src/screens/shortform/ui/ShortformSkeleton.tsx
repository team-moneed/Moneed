export function ShortformCarouselSkeleton({ count }: { count: number }) {
    return (
        <div className='mt-4 flex gap-[.8rem] w-full overflow-hidden mask-right'>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    className='w-[calc(30%-1.6rem)] lg:w-[calc(20%-1.6rem)] shrink-0 cursor-pointer bg-moneed-gray-5 animate-pulse aspect-[9/16] rounded-[.8rem]'
                    key={index}
                ></div>
            ))}
        </div>
    );
}

export function ShortformPageSkeleton({ count }: { count: number }) {
    return (
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-y-[1.6rem] gap-x-[1.6rem] mt-4 md:gap-y-[1.6rem] mb-[.6rem]'>
            {Array.from({ length: count }).map((_, index) => (
                <div className='bg-moneed-gray-5 animate-pulse aspect-[9/16] rounded-[.8rem]' key={index}></div>
            ))}
        </div>
    );
}
