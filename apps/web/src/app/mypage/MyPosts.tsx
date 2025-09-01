import MypageBox from '@/components/Mypage/MypageBox';
import MyPageBoxSkeleton from '@/components/Skeletons/mypage/MyPageBoxSkeleton';
import { useSuspenseMyPosts } from '@/queries/posts.query';
import withSuspense from '@/components/HOC/withSuspense';

function MyPosts() {
    const { data: posts } = useSuspenseMyPosts();

    return <MypageBox menu='내가 작성한 게시글' count={posts.length} href={'/mypost'}></MypageBox>;
}

export default withSuspense(MyPosts, <MyPageBoxSkeleton />);
