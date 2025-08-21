'use client';
import { useParams, useSearchParams } from 'next/navigation';
import { SnackbarTrigger } from '@/components/Snackbar';
import { getPost } from '@/apis/post.api';
import { useSuspenseQuery } from '@tanstack/react-query';
import PostSection from './PostSection';
import CommentSection from './CommentSection';
import dynamic from 'next/dynamic';

const StockTypeBar = dynamic(() => import('@/app/community/StockTypeBar'), { ssr: false });

export default function PostDetail() {
    const searchParams = useSearchParams();
    const { postId } = useParams<{ postId: string }>();
    const reason = searchParams.get('reason') ?? undefined;
    const { data: post } = useSuspenseQuery({
        queryKey: ['post', Number(postId)],
        queryFn: () => getPost({ postId: Number(postId) }),
    });

    const { stock, comments } = post;

    return (
        <>
            <StockTypeBar />
            <div className='px-8 max-w-512 mx-auto'>
                <div className='hidden lg:block font-semibold leading-[140%] text-[1.6rem] ml-[.4rem] text-moneed-gray-9 mb-4'>
                    {stock.name} 커뮤니티
                </div>
                <div className='lg:flex gap-12'>
                    <PostSection {...post} />
                    <CommentSection postId={postId} comments={comments} />
                </div>
            </div>
            <SnackbarTrigger reason={reason} />
        </>
    );
}
