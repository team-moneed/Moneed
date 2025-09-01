'use client';

import { ReactNode, useEffect, useRef } from 'react';

type DropdownProps = {
    children?: ReactNode;
    onClose: () => void;
};

const Dropdown = ({ children, onClose }: DropdownProps) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                e.stopPropagation();
                onClose();
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [onClose]);

    return <div ref={dropdownRef}>{children}</div>;
};

export type PrimaryDropdownProps = {
    dropdownMenus: { text: string; icon: string; onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }[];
    closeDropdown: () => void;
};

export const PrimaryDropdown = ({ dropdownMenus, closeDropdown }: PrimaryDropdownProps) => {
    return (
        <div className='relative z-2 pointer-events-auto'>
            <Dropdown onClose={closeDropdown}>
                <div className='absolute flex flex-col py-[2.8rem] top-0 right-10 z-50 bg-white shadow-custom rounded-[.8rem] min-w-[22.6rem]'>
                    {dropdownMenus.map(menu => (
                        <button
                            key={menu.text}
                            type='button'
                            className='h-[4.8rem] cursor-pointer flex justify-center items-center whitespace-nowrap hover:bg-moneed-gray-4'
                            onClick={e => {
                                e.stopPropagation();
                                menu.onClick(e);
                            }}
                        >
                            <div className='overflow-hidden aspect-square w-[1.8rem] mr-[.6rem] '>
                                <img src={menu.icon} alt={menu.text} className='w-full h-full object-cover' />
                            </div>
                            <div className='font-semibold text-md leading-[140%] text-moneed-black'>{menu.text}</div>
                        </button>
                    ))}
                </div>
            </Dropdown>
        </div>
    );
};
export default Dropdown;
