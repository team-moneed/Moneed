import { SnackbarTrigger } from '@/shared/ui/Snackbar';
import PostSection from './PostSection';
import CommentSection from './CommentSection';
import { fetchPost, fetchPostComments } from '@/features/post';
import { DesktopHeader } from '@/shared/ui/Header';
import { DecodedToken } from '@moneed/auth';
import { getCookie } from '@/shared/utils/cookie.server';
import { decodeJwt } from 'jose';
import { MobileHeader } from './MobileHeader';

export default async function PostDetail({
    params,
    searchParams,
}: {
    params: Promise<{ postId: string }>;
    searchParams: Promise<{ reason: string }>;
}) {
    const { postId } = await params;
    const { reason } = await searchParams;
    const tokenName = process.env.JWT_ACCESS_NAME || 'access_token';
    const token = await getCookie(tokenName);
    const user = decodeJwt(token || '') as DecodedToken;
    const post = await fetchPost({ postId: Number(postId), userId: user?.id });
    const comments = await fetchPostComments({ postId: Number(postId) });

    return (
        <>
            <MobileHeader stockName={post.stock.nameKo} />
            <DesktopHeader />
            <div className='hidden lg:block font-semibold leading-[140%] text-[1.6rem] ml-[.4rem] text-moneed-gray-9 mb-4'>
                {post.stock.nameKo} 커뮤니티
            </div>
            <div className='lg:flex gap-12'>
                <PostSection post={post} commentsCount={comments.length} />
                <CommentSection postId={Number(postId)} comments={comments} />
            </div>
            <SnackbarTrigger reason={reason} />
        </>
    );
}
