'use client';
import { usePathname, useRouter } from 'next/navigation';
import { PATH, DYNAMIC_PATH } from '@/shared/config';

export default function MobileWritePostButton() {
    const router = useRouter();
    const pathname = usePathname();

    const moveToWritePost = () => {
        const lastPathSegment = pathname.split('/').pop();

        if (location.pathname.startsWith(`${PATH.COMMUNITY}/`)) {
            if (lastPathSegment && decodeURIComponent(lastPathSegment) !== '전체') {
                router.push(DYNAMIC_PATH.WRITEPOST_SYMBOL(lastPathSegment));
            } else {
                router.push(PATH.WRITEPOST);
            }
        } else {
            router.push(PATH.WRITEPOST);
        }
    };

    return (
        <button
            type='button'
            onClick={moveToWritePost}
            className='aspect-square w-[5.2rem] bg-moneed-brand absolute bottom-[calc(100%+2rem)] flex items-center justify-center rounded-full right-8'
        >
            <img src='/icon/icon-edit.svg' alt='게시글 작성' />
        </button>
    );
}
