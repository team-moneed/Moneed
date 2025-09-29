import Footer from '@/6_shared/ui/layout/Footer';
import RootNav from '@/6_shared/ui/layout/RootNav';

export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <RootNav />
            <main className='flex-1'>{children}</main>
            <Footer />
        </>
    );
}
