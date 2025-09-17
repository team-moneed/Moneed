import { Suspense } from 'react';

export default function MypageLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Suspense>{children}</Suspense>
        </>
    );
}
