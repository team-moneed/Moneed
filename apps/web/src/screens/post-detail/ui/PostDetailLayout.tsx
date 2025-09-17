import Footer from '@/shared/ui/layout/Footer';
import RootNav from '@/shared/ui/layout/RootNav';

export default async function PostDetailLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <RootNav />
            {children}
            <Footer />
        </>
    );
}
