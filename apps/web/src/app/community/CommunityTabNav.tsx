'use client';

import { cn } from '@/utils/style';
import { useEffect, useState } from 'react';

interface TabItem {
    id: string;
    label: string;
    href: string;
}

interface CommunityTabNavProps {
    tabs: TabItem[];
    className?: string;
}

export default function CommunityTabNav({ tabs, className }: CommunityTabNavProps) {
    const [hash, setHash] = useState('');

    const handleHashChange = () => {
        const hash = window.location.hash;
        setHash(hash);
    };

    useEffect(() => {
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    return (
        <div className={cn('flex gap-4 pt-8 items-start border-b-2 border-moneed-gray-5', className)}>
            {tabs.map(tab => (
                <a
                    key={tab.id}
                    href={tab.href}
                    className={cn(
                        'text-moneed-gray-7 mr-[1.2rem] sm:text-lg sm:leading-[140%] cursor-pointer pb-[.3rem]',
                        hash === tab.href && 'text-moneed-black border-b-[3px] border-b-moneed-brand',
                    )}
                >
                    {tab.label}
                </a>
            ))}
        </div>
    );
}
