'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/6_shared/utils/style';

type TextLinkProps = {
    className?: string;
    href: string;
    children?: ReactNode;
};

const TextLink = ({ className, href, children }: TextLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={href} className={cn(isActive ? 'text-moneed-black' : 'text-moneed-gray-6', className)}>
            {children}
        </Link>
    );
};
export default TextLink;
