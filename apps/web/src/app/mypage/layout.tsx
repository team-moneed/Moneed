import { DesktopHeader, MobileHeader } from '@/components/Layout/Header';
import { Suspense } from 'react';

export default function MypageLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <MobileHeader />
            <DesktopHeader />
            <Suspense>{children}</Suspense>
        </>
    );
}
