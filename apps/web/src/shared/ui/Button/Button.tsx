'use client';

import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/shared/utils/style';
import { cn } from '@/shared/utils/style';

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
