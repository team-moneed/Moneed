import Icon from '../Icon';

export default function CommentSkeleton() {
    return (
        <div className='space-y-3'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <div className='w-[3.2rem] h-[3.2rem] bg-moneed-gray-4 rounded-full animate-pulse'></div>
                    <div className='w-[16rem] h-[1.6rem] bg-moneed-gray-4 rounded animate-pulse'></div>
                </div>
                <Icon iconUrl='/icon/icon-more.svg' width={24} height={24} className='animate-pulse' />
            </div>
            <div className='space-y-2'>
                <div className='w-full h-[1.4rem] bg-moneed-gray-4 rounded animate-pulse'></div>
                <div className='w-full h-[1.4rem] bg-moneed-gray-4 rounded animate-pulse'></div>
                <div className='w-1/2 h-[1.4rem] bg-moneed-gray-4 rounded animate-pulse'></div>
            </div>
        </div>
    );
}
