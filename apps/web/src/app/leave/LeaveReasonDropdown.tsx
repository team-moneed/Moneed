import { cn } from '@/utils/style';
import { LEAVE_REASON } from '@/shared/config/leaveReason';
import { useEffect, useRef, useState } from 'react';

type LeaveReasonDropdownProps = {
    setSelectedReason: (reasonId: number) => void;
    selectedReason: number;
};

export default function LeaveReasonDropdown({ setSelectedReason, selectedReason }: LeaveReasonDropdownProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleReasonSelect = (reasonId: number) => {
        setSelectedReason(reasonId);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const selectedReasonText = LEAVE_REASON.find(reason => reason.id === selectedReason)?.reason || '';

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                e.stopPropagation();
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <div className='relative w-full mt-[1.6rem]' ref={dropdownRef}>
            <button
                type='button'
                onClick={toggleDropdown}
                className={cn(
                    'w-full h-[4.8rem] py-[1.2rem] px-[1.6rem] rounded-[1.2rem] border-[1.5px] border-moneed-gray-5 text-[1.6rem] font-normal leading-[140%] appearance-none cursor-pointer hover:border-moneed-gray-6 bg-white flex items-center justify-between',
                    selectedReason === 0 ? 'text-moneed-gray-6' : 'text-moneed-black',
                    isDropdownOpen && 'rounded-b-none',
                )}
            >
                <span>{selectedReasonText}</span>
                <img
                    src='/icon/icon-arrow-down.svg'
                    alt='arrow'
                    className={cn('transition-transform duration-200', isDropdownOpen ? 'rotate-180' : '')}
                />
            </button>

            {/* 드롭다운 옵션들 */}
            {isDropdownOpen && (
                <div className='absolute top-full left-0 right-0 h-[30rem] lg:h-auto overflow-y-auto bg-white border-[1.5px] border-moneed-gray-5 rounded-b-[1.2rem] z-10'>
                    {LEAVE_REASON.map((reason, index) => (
                        <button
                            key={reason.id}
                            type='button'
                            onClick={() => handleReasonSelect(reason.id)}
                            className={cn(
                                'w-full px-[1.6rem] py-[1.2rem] text-left text-[1.6rem] font-normal leading-[140%] hover:bg-moneed-gray-4 transition-colors',
                                reason.id === selectedReason
                                    ? 'text-moneed-black bg-moneed-gray-1'
                                    : 'text-moneed-black',
                                index !== LEAVE_REASON.length - 1 && 'border-b border-moneed-gray-5',
                            )}
                        >
                            {reason.reason}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
