import { ComponentPropsWithRef } from 'react';

type PropType = ComponentPropsWithRef<'button'>;

export default function NextButton(props: PropType) {
    const { children, ...restProps } = props;

    return (
        <button
            className='group flex items-center justify-center rounded-full bg-gray-100 p-2 shadow-md hover:bg-gray-200 focus:outline-none disabled:opacity-50'
            type='button'
            {...restProps}
        >
            <img src='/icon/icon-arrow-right.svg' alt='다음' className='w-full h-full object-cover' />
            {children}
        </button>
    );
}
