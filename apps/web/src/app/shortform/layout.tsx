import { DesktopHeader, MobileHeader } from '@/components/Layout/Header';
import { ShortformPageSkeleton } from '@/components/Skeletons/shortform/ShortformSkeleton';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function ShortformLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='h-screen'>
            <MobileHeader />
            <DesktopHeader />
            <Suspense fallback={<ShortformPageSkeleton count={20} />}>{children}</Suspense>
        </div>
    );
}
