import Footer from '@/shared/ui/layout/Footer';
import { ShortformPageSkeleton } from '@/screens/shortform/ui/ShortformSkeleton';
import { Suspense } from 'react';
import RootNav from '@/shared/ui/layout/RootNav';

export const dynamic = 'force-dynamic';

export default function ShortformLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <RootNav />
            <main className='flex-1'>
                <Suspense fallback={<ShortformPageSkeleton count={20} />}>{children}</Suspense>
            </main>
            <Footer />
        </>
    );
}
