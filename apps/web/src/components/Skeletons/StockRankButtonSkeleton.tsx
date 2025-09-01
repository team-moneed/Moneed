export function StockRankButtonSkeleton() {
    return (
        <div className='rounded-[1.2rem] h-[4.2rem] w-[14rem] flex items-center text-[1.4rem] font-semibold bg-moneed-gray-4 animate-pulse' />
    );
}

export function StockRankButtonsSkeleton({ count }: { count: number }) {
    return (
        <div className='flex gap-4'>
            {Array.from({ length: count }).map((_, index) => (
                <StockRankButtonSkeleton key={index} />
            ))}
        </div>
    );
}
