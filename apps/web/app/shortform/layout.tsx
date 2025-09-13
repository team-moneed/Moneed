import { DesktopHeader, MobileHeader } from '@/shared/ui/Header';
import { ShortformPageSkeleton } from '@/screens/shortform/ui/ShortformSkeleton';
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
