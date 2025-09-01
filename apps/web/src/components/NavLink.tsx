'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/style';

type NavLinkType = {
    className?: string;
    active?: boolean;
    icon?: string;
    activeIcon?: string;
    href: string;
    children?: ReactNode;
};

const NavLink = ({ className, icon, activeIcon, href, children }: NavLinkType) => {
    const pathname = usePathname();
    const active = pathname === href;

    return (
        <Link
            href={href}
            className={cn(
                'text-[1rem] flex flex-col items-center',
                active ? 'text-moneed-black' : 'text-moneed-gray-6',
                className,
            )}
        >
            {icon ? (
                <img src={active ? activeIcon || icon : icon} alt='icon' className='size-[2.4rem] text-inherit' />
            ) : (
                icon
            )}
            {children}
        </Link>
    );
};
export default NavLink;
