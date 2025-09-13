import HotStockSection from '@/screens/community/ui/HotStockSection';
import CommunityTabNav from '@/screens/community/ui/CommunityTabNav';
import HotPostsSection from './HotPostsSection';
import Top5Section from './Top5Section';
import { DesktopHeader, MobileHeader } from '@/shared/ui/Header';
import StockTypeBar from './StockTypeBar';
import HotVote from './HotVote';

const hashObj = {
    top5: 'top5',
    category: 'category',
    vote: 'vote',
    hotPosts: 'hotPosts',
} as const;

const stringToHash = (str: string) => {
    return `#${str}`;
};

const communityTabs = [
    {
        id: hashObj.top5,
        label: 'Top 5',
        href: stringToHash(hashObj.top5),
    },
    {
        id: hashObj.category,
        label: '지금 뜨는 종목',
        href: stringToHash(hashObj.category),
    },
    {
        id: hashObj.vote,
        label: '지금 핫한 투표',
        href: stringToHash(hashObj.vote),
    },
    {
        id: hashObj.hotPosts,
        label: '인기 급상승 게시글',
        href: stringToHash(hashObj.hotPosts),
    },
];

export default function CommunityPage() {
    return (
        <>
            <MobileHeader />
            <DesktopHeader />
            <StockTypeBar />
            <div>
                <CommunityTabNav tabs={communityTabs} />
                <Top5Section id={hashObj.top5} />
                <HotStockSection id={hashObj.category} />
                <HotVote id={hashObj.vote} />
                <HotPostsSection id={hashObj.hotPosts} />
            </div>
        </>
    );
}
