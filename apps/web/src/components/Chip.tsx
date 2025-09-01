'use client';

import { cn } from '@/utils/style';
import Link from 'next/link';
import { ReactNode } from 'react';

interface ChipProps {
    className?: string;
    active?: boolean;
    label: string;
    disabled?: boolean;
    children?: ReactNode;
}

interface ChipLinkProps extends ChipProps {
    href: string;
}

interface ChipButtonProps extends ChipProps {
    onClick: () => void;
}

export const ChipButton = ({ className, active, label, disabled, children, onClick }: ChipButtonProps) => {
    return (
        <button
            className={cn(
                'rounded-[1.2rem] px-[2.4rem] py-[1.2rem] flex items-center text-[1.4rem] font-semibold whitespace-nowrap',
                active ? 'bg-moneed-black text-white' : 'bg-moneed-gray-4 text-moneed-black',
                className,
            )}
            onClick={onClick}
            disabled={disabled}
            type='button'
            aria-label={label}
        >
            {label}
            <span className='text-[1.4rem] font-semibold'>{children}</span>
        </button>
    );
};

export const ChipLink = ({ className, active, label, href, disabled, children }: ChipLinkProps) => {
    return (
        <Link
            className={cn(
                'rounded-[1.2rem] px-[2.4rem] py-[1.2rem] flex items-center text-[1.4rem] font-semibold',
                active ? 'bg-moneed-black text-white' : 'bg-moneed-gray-4 text-moneed-black',
                disabled && 'opacity-50 cursor-not-allowed',
                className,
            )}
            href={href}
            aria-label={label}
        >
            {label}
            <span className='text-[1.4rem] font-semibold'>{children}</span>
        </Link>
    );
};
