import { PATH } from '@/shared/config';
import { useMyComments } from '../query';
import withSuspense from '@/shared/ui/withSuspense';
import Link from 'next/link';

function MyComments() {
    const { data: comments } = useMyComments();
    return (
        <Link
            className='p-[1.6rem] flex-col justify-center gap-4 rounded-[1.6rem] border border-solid border-moneed-gray-5 cursor-pointer'
            href={PATH.MYCOMMENT}
        >
            <div className='text-[2.4rem] font-medium leading-[140%] text-moneed-black'>{comments.length ?? 0}</div>
            <div className='text-[1.4rem] font-semibold leading-[140%] text-moneed-gray-9'>내가 작성한 댓글</div>
        </Link>
    );
}

function MyCommentsSkeleton() {
    return <div className='h-[10rem] w-full rounded-[1.6rem] bg-moneed-gray-5 animate-pulse'></div>;
}

export default withSuspense(MyComments, <MyCommentsSkeleton />);
