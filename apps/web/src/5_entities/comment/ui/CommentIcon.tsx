import Icon from '@/6_shared/ui/Icon';

export default function CommentIcon({ commentCount }: { commentCount: number }) {
    return (
        <div className='flex items-center gap-[.4rem]'>
            <Icon iconUrl='/images/commentIcon.svg' width={20} height={20} />
            <span className='mr-4 text-[1.4rem] font-normal leading-[140%] text-moneed-gray-8'>{commentCount}</span>
        </div>
    );
}
