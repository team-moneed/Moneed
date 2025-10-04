import { PATH } from '@/6_shared/config';
import Button from '@/6_shared/ui/Button/Button';
import { useRouter } from 'next/navigation';

export default function CancleButton() {
    const router = useRouter();

    const cancelChangeProfile = () => {
        const yes = confirm('수정하던 내용은 저장되지 않아요. 다음에 수정할까요?');
        if (yes) {
            router.push(PATH.MYPAGE);
        }
    };

    return (
        <Button
            type='button'
            onClick={cancelChangeProfile}
            variant='secondary'
            className='border border-solid border-moneed-gray-6 text-[1.6rem] font-bold leading-[140%] py-[1.8rem] w-full flex-1/3'
        >
            취소
        </Button>
    );
}
