import Footer from '@/shared/ui/layout/Footer';
import RootNav from '@/shared/ui/layout/RootNav';

export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <RootNav />
            <main className='flex-1'>{children}</main>
            <Footer />
        </>
    );
}
