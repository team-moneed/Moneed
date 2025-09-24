'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/utils/style';

interface IconLinkProps {
    className?: string;
    icon: ReactNode;
    activeIcon?: ReactNode;
    href: string;
    label?: string;
    size?: number;
}

const IconLink = ({ className, icon, activeIcon, href, label, size = 24 }: IconLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    activeIcon =
        typeof activeIcon === 'string' ? (
            <img src={activeIcon} alt={label ?? 'icon'} style={{ width: size, height: size }} />
        ) : (
            activeIcon
        );
    icon =
        typeof icon === 'string' ? (
            <img src={icon} alt={label ?? 'icon'} style={{ width: size, height: size }} />
        ) : (
            icon
        );

    return (
        <Link
            href={href}
            className={cn(
                `w-full flex flex-col items-center`,
                isActive ? 'text-moneed-black' : 'text-moneed-gray-6',
                className,
            )}
        >
            {isActive && activeIcon ? activeIcon : icon}
            {label && <p className='text-[1.2rem] font-semibold'>{label}</p>}
        </Link>
    );
};
export default IconLink;
