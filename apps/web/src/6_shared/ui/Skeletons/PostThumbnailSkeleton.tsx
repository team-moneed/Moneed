export default function PostThumbnailSkeleton() {
    return (
        <div className='relative border border-solid border-moneed-gray-5 rounded-[1.8rem] mb-[1.6rem] animate-pulse h-[20rem] bg-moneed-gray-5'></div>
    );
}

export function PostThumbnailSkeletons({ count }: { count: number }) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-y-[.6rem] gap-x-[1.6rem] mt-4 md:gap-y-[1.2rem]'>
            {Array.from({ length: count }).map((_, index) => (
                <PostThumbnailSkeleton key={index} />
            ))}
        </div>
    );
}
