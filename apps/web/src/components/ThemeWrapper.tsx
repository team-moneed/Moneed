'use client';

import { ReactNode, useEffect } from 'react';

interface ThemeWrapperProps {
    theme: 'dark' | 'light';
    children: ReactNode;
}

const ThemWrapperBody = ({ theme, children }: ThemeWrapperProps) => {
    useEffect(() => {
        if (theme === 'dark') {
            document.body.classList.add('min-h-screen', 'bg-black');
        } else {
            document.body.classList.add('min-h-screen', 'bg-white');
        }

        return () => {
            document.body.classList.remove('min-h-screen', 'bg-black', 'bg-white');
        };
    }, [theme]);

    return <>{children}</>;
};

export default ThemWrapperBody;
