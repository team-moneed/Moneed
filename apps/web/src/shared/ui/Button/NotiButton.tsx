'use client';
// import { useToggle } from '@/shared/hooks/useToggle';
import { useAuth } from '@/shared/hooks/useAuth';
import { cn } from '@/shared/utils/style';
import { ComponentPropsWithRef } from 'react';

type PropType = ComponentPropsWithRef<'button'>;

export default function NotiButton(props: PropType) {
    // const { isOpen, toggle } = useToggle();
    const { isLoggedIn } = useAuth();

    return (
        <button
            className={cn('w-[2.4rem] h-[2.4rem] relative ', !isLoggedIn && 'hidden', props.className)}
            type='button'
            {...props}
        >
            <img src='/icon/icon-alarm.svg' alt='알림' className='size-full' />
            {/* {isOpen && (
                <div className='absolute top-0 right-0 w-[2.4rem] h-[2.4rem] bg-red-500'>
                    <img src='/icon/icon-alarm.svg' alt='알림' />
                </div>
            )} */}
        </button>
    );
}
