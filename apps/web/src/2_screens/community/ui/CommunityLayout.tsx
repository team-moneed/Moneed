import Footer from '@/6_shared/ui/layout/Footer';
import StockTypeBar from '@/2_screens/community/ui/StockTypeBar';
import RootNav from '@/6_shared/ui/layout/RootNav';
import BottomNav from '@/6_shared/ui/layout/BottomNav';
import { hashObj } from './CommunityPage';
import CommunityTabNav from './CommunityTabNav';

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

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <RootNav />
            <BottomNav />
            <StockTypeBar />
            <CommunityTabNav tabs={communityTabs} />
            <main className='flex-1'>{children}</main>
            <Footer />
        </>
    );
}
