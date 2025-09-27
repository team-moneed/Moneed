import BottomNav from '@/6_shared/ui/layout/BottomNav';
import Footer from '@/6_shared/ui/layout/Footer';
import SubNav from '@/6_shared/ui/layout/SubNav';

export default function SmartTalkLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SubNav title='스맛톡 둘러보기' />
            <main className='flex-1'>
                <div className='px-[2rem] py-[6rem]'>{children}</div>
            </main>
            <Footer />
            <BottomNav />
        </>
    );
}
