import { ComponentPropsWithRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import arrowBackIcon from 'public/icon/icon-arrow-back.svg';

type PropType = ComponentPropsWithRef<'button'>;

export default function GoBackButton(props: PropType) {
    const router = useRouter();
    const { children, ...restProps } = props;

    const handleGoBack = () => {
        router.back();
    };

    return (
        <button
            className='group flex items-center justify-center p-2 focus:outline-none disabled:opacity-50'
            type='button'
            onClick={handleGoBack}
            {...restProps}
        >
            <Image src={arrowBackIcon} alt='뒤로가기' className='w-full h-full object-cover' />
            {children}
        </button>
    );
}
