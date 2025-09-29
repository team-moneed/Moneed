import Footer from '@/6_shared/ui/layout/Footer';
import { ShortformPageSkeleton } from '@/2_screens/shortform/ui/ShortformSkeleton';
import { Suspense } from 'react';
import RootNav from '@/6_shared/ui/layout/RootNav';
import BottomNav from '@/6_shared/ui/layout/BottomNav';

export const dynamic = 'force-dynamic';

export default function ShortformLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <RootNav />
            <BottomNav />
            <main className='flex-1'>
                <Suspense fallback={<ShortformPageSkeleton count={20} />}>{children}</Suspense>
            </main>
            <Footer />
        </>
    );
}
