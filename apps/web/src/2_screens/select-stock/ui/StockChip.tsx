import { ReactNode } from 'react';

type StockTypeChipType = {
    className?: string;
    active?: boolean;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    icon?: string;
    children?: ReactNode;
};

const StockTypeChip = ({ className = '', active, label, onClick, disabled, icon }: StockTypeChipType) => {
    return (
        <button
            type='button'
            className={`rounded-[1.2rem] px-[1.6rem] h-[44px] flex items-center justify-center text-[1.2rem] font-semibold leading-[135%] 
                ${active ? 'bg-moneed-black text-white border border-moneed-black' : 'bg-moneed-white text-moneed-black border border-moneed-gray-5'} 
                box-border ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <img src={icon} alt='icon' className='w-[16px] h-[16px] mr-[.5rem]' />}
            {label}
        </button>
    );
};

export default StockTypeChip;
