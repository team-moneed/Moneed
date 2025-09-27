import { SnackbarTrigger } from '@/6_shared/ui/Snackbar';
import PostSection from '@/2_screens/post-detail/ui/PostSection';
import CommentSection from '@/2_screens/post-detail/ui/CommentSection';
import { fetchPost, fetchPostComments } from '@/4_features/post';
import { verifyToken } from '@moneed/auth';
import TokenCookie from '@/6_shared/utils/token.cookie';
import { TOKEN_KEY } from '@/6_shared/config';
import SubNav from '@/6_shared/ui/layout/SubNav';
import RootNav from '@/6_shared/ui/layout/RootNav';

export default async function PostDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ postId: string }>;
    searchParams: Promise<{ reason: string }>;
}) {
    const { postId } = await params;
    const { reason } = await searchParams;
    const accessToken = await TokenCookie.getCookie(TOKEN_KEY.ACCESS_TOKEN);
    const sessionResult = await verifyToken({ jwt: accessToken ?? '', key: process.env.SESSION_SECRET! });
    const userId = sessionResult.data?.id;
    const post = await fetchPost({ postId: Number(postId), userId });
    const comments = await fetchPostComments({ postId: Number(postId) });

    return (
        <>
            <RootNav className='hidden sm:flex' />
            <SubNav title={post.stock.nameKo + ' 커뮤니티'} className='sm:hidden' />
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
