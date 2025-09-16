import Footer from '@/shared/ui/layout/Footer';
import StockTypeBar from '@/screens/community/ui/StockTypeBar';
import RootNav from '@/shared/ui/layout/RootNav';

export const hashObj = {
    top5: 'top5',
    category: 'category',
    vote: 'vote',
    hotPosts: 'hotPosts',
} as const;

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <RootNav />
            <StockTypeBar />
            <main className='flex-1'>{children}</main>
            <Footer />
        </>
    );
}
