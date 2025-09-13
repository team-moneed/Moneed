import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type LnbType = {
    className?: string;
    active?: boolean;
    icon?: string;
    activeIcon?: string;
    to: string;
    children?: ReactNode;
};

const lnbLink = ({ className, active, icon, activeIcon, to, children }: LnbType) => {
    return (
        <Link
            to={to}
            className={`flex items-center gap-[2.4rem] p-4 rounded-[.8rem] ${
                active ? 'text-black bg-moneed-gray-5' : 'text-moneed-gray-8'
            } ${className}`}
        >
            {icon ? (
                <img src={active ? activeIcon || icon : icon} alt='icon' className='w-[2.4rem] h-[2.4rem]' />
            ) : (
                icon
            )}
            {children}
        </Link>
    );
};
export default lnbLink;
