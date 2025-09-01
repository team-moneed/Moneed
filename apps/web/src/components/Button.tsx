'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/style';

const buttonVariants = cva('rounded-[1.6rem] disabled:pointer-events-none disabled:cursor-not-allowed', {
    variants: {
        variant: {
            primary:
                'bg-moneed-black text-moneed-white hover:bg-moneed-gray-9 active:bg-moneed-gray-9 disabled:bg-moneed-gray-4 disabled:text-moneed-gray-6',
            secondary:
                'bg-moneed-white text-moneed-gray-9 hover:bg-moneed-gray-5 active:bg-moneed-gray-5 border-[1.5px] border-moneed-gray-5 disabled:bg-moneed-gray-4 disabled:text-moneed-gray-6',
            ghost: 'bg-moneed-white text-moneed-gray-7 border-[1.5px] border-moneed-gray-6 disabled:bg-moneed-gray-4 disabled:text-moneed-gray-6',
            brand: 'bg-moneed-brand text-moneed-black hover:bg-moneed-brand-point active:bg-moneed-brand-point disabled:bg-moneed-gray-6 disabled:text-moneed-white',
            danger: 'bg-moneed-red-light text-moneed-red hover:bg-moneed-error-point active:bg-moneed-error-point disabled:bg-moneed-gray-4 disabled:text-moneed-gray-6',
        },
    },
    defaultVariants: {
        variant: 'primary',
    },
});

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, disabled = false, ...props }, ref) => {
        return (
            <button className={cn(buttonVariants({ variant }), className)} disabled={disabled} ref={ref} {...props} />
        );
    },
);

Button.displayName = 'Button';

export default Button;
