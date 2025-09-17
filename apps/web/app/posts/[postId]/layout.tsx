// import BottomNav from '@/shared/ui/layout/BottomNav';
import Footer from '@/shared/ui/layout/Footer';
// import NavBar from '@/shared/ui/layout/SubNav';

export default async function PostDetailLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* <header>
                <NavBar />
                <BottomNav />
            </header> */}
            <main className='flex-1'>
                <div className='max-w-512 mx-auto px-8'>{children}</div>
            </main>
            <Footer />
        </>
    );
}
