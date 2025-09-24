import Link from 'next/link';
import { buttonVariants } from '@/shared/utils/style';
import { cn } from '@/shared/utils/style';
import { VariantProps } from 'class-variance-authority';
import React from 'react';

export interface ButtonLinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
        VariantProps<typeof buttonVariants> {}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
    ({ className, variant = 'primary', href, children, ...props }, ref) => {
        return (
            <Link href={href ?? '/'} className={cn(buttonVariants({ variant }), className)} ref={ref} {...props}>
                {children}
            </Link>
        );
    },
);

ButtonLink.displayName = 'ButtonLink';

export default ButtonLink;
