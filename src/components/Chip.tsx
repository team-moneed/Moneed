import { ReactNode } from 'react';

type ChipType = {
    className?: string;
    active?: boolean;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    children?: ReactNode;
};

const Chip = ({ className, active, label, onClick, disabled, children }: ChipType) => {
    return (
        <button
            type='button'
            className={`rounded-[1.2rem] px-[1.6rem] py-[.7rem] flex items-center text-[1.4rem] font-semibold ${
                active ? 'bg-[var(--moneed-black)] text-white' : 'bg-[var(--moneed-gray-4)] text-[var(--moneed-black)]'
            } ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
            <span className='text-[1.4rem] font-semibold'>{children}</span>
        </button>
    );
};

export default Chip;
