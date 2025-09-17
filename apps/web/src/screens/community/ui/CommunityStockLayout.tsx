import { Suspense } from 'react';

export default function CommunityStockLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Suspense>{children}</Suspense>
        </>
    );
}
