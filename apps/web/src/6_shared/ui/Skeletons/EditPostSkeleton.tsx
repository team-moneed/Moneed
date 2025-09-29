export default function EditPostSkeleton() {
    return (
        <div className='px-8 max-w-512 mx-auto flex flex-col gap-[1.6rem] h-full'>
            <div className='flex h-[2.6rem] items-center gap-[.4rem]'>
                <div className='rounded-full size-[2.4rem] bg-moneed-shade-bg' />
                <div className='w-[10rem] h-[2.4rem] bg-moneed-shade-bg animate-pulse rounded-2xl' />
            </div>
            <div className='flex items-center h-[3.8rem]'>
                <div className='w-full h-[2.4rem] bg-moneed-shade-bg animate-pulse rounded-2xl' />
            </div>
            <div className='flex-grow-1'>
                <div className='w-full h-full bg-moneed-shade-bg animate-pulse rounded-2xl' />
            </div>
            <div className='h-[5.2rem] bg-white flex items-center justify-between transition-all duration-300 bottom-0 w-full'>
                <div className='flex items-center justify-between w-full'>
                    <div className='rounded-full size-[3.6rem] bg-moneed-shade-bg' />
                    <div className='rounded-full size-[3.6rem] bg-moneed-shade-bg' />
                </div>
            </div>
        </div>
    );
}
