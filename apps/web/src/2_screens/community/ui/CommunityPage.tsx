import Top5Section from '@/2_screens/community/ui/Top5Section';
import HotVote from '@/2_screens/community/ui/HotVote';
import HotPostsSection from '@/2_screens/community/ui/HotPostsSection';
import HotStockSection from '@/2_screens/community/ui/HotStockSection';

export const hashObj = {
    top5: 'top5',
    category: 'category',
    vote: 'vote',
    hotPosts: 'hotPosts',
} as const;

export default function CommunityPage() {
    return (
        <>
            <Top5Section id={hashObj.top5} />
            <HotStockSection id={hashObj.category} />
            <HotVote id={hashObj.vote} />
            <HotPostsSection id={hashObj.hotPosts} />
        </>
    );
}
