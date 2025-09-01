import Icon from '../Icon';

export default function PostCommentButton({ commentCount }: { commentCount: number }) {
    return (
        <button className='flex items-center gap-[.4rem]'>
            <Icon iconUrl='/commentIcon.svg' width={20} height={20} />
            <span className='mr-4 text-[1.4rem] font-normal leading-[140%] text-moneed-gray-8'>{commentCount}</span>
        </button>
    );
}
