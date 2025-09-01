import { Suspense } from 'react';

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
    return <Suspense>{children}</Suspense>;
}
