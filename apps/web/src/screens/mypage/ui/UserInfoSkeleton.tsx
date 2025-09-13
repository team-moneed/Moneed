export default function UserInfoSkeleton() {
    return (
        <div className='p-[1.6rem] justify-center items-center rounded-[1.6rem] border border-solid border-moneed-gray-5 animate-pulse'>
            <div className='flex justify-center'>
                <div className='rounded-full overflow-hidden aspect-square w-[5.6rem] bg-moneed-gray-5 animate-pulse' />
            </div>
            <div className='flex flex-col w-full justify-center items-center gap-y-[.8rem]'>
                <div className='h-[2rem] w-[7rem] mt-[.8rem] font-bold bg-moneed-gray-5 animate-pulse rounded-[1rem]' />
                <div className='h-[1.4rem] w-[10rem] font-normal bg-moneed-gray-5 animate-pulse rounded-[1rem]' />
            </div>
        </div>
    );
}
