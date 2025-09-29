import Footer from '@/6_shared/ui/layout/Footer';

export default async function PostDetailLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Footer />
        </>
    );
}
