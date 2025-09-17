import { SnackbarTrigger } from '@/shared/ui/Snackbar';
import PostSection from '@/screens/post/post-detail/ui/PostSection';
import CommentSection from '@/screens/post/post-detail/ui/CommentSection';
import { fetchPost, fetchPostComments } from '@/features/post';
import { verifyToken } from '@moneed/auth';
import { getCookie } from '@/shared/utils/cookie.server';
import { TOKEN_KEY } from '@/shared/config';
import SubNav from '@/shared/ui/layout/SubNav';

export default async function PostDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ postId: string }>;
    searchParams: Promise<{ reason: string }>;
}) {
    const { postId } = await params;
    const { reason } = await searchParams;
    const accessToken = await getCookie(TOKEN_KEY.ACCESS_TOKEN);
    const sessionResult = await verifyToken({ jwt: accessToken ?? '', key: process.env.SESSION_SECRET! });
    const userId = sessionResult.data?.id;
    const post = await fetchPost({ postId: Number(postId), userId });
    const comments = await fetchPostComments({ postId: Number(postId) });

    return (
        <>
            <SubNav title={post.stock.nameKo + ' 커뮤니티'} />
            <main className='flex-1'>
                <div className='hidden sm:block font-semibold leading-[140%] text-[1.6rem] ml-[.4rem] text-moneed-gray-9 mb-4'>
                    {post.stock.nameKo} 커뮤니티
                </div>
                <div className='sm:flex gap-12'>
                    <PostSection post={post} commentsCount={comments.length} />
                    <CommentSection postId={Number(postId)} comments={comments} />
                </div>
            </main>
            <SnackbarTrigger reason={reason} />
        </>
    );
}
