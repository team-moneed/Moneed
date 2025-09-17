import Top5Section from '@/screens/community/ui/Top5Section';
import { hashObj } from '@/screens/community/ui/CommunityLayout';
import HotVote from '@/screens/community/ui/HotVote';
import HotPostsSection from '@/screens/community/ui/HotPostsSection';
import HotStockSection from '@/screens/community/ui/HotStockSection';
import CommunityTabNav from '@/screens/community/ui/CommunityTabNav';

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
            <CommunityTabNav tabs={communityTabs} />
            <Top5Section id={hashObj.top5} />
            <HotStockSection id={hashObj.category} />
            <HotVote id={hashObj.vote} />
            <HotPostsSection id={hashObj.hotPosts} />
        </>
    );
}
