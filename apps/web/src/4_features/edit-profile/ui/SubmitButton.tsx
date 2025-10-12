import Button from '@/6_shared/ui/Button/Button';
import { useFormStatus } from 'react-dom';

export default function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type='submit'
            variant='primary'
            className='text-[1.6rem] font-bold leading-[140%] py-[1.8rem] w-full flex-2/3'
            disabled={pending}
        >
            {pending ? '저장 중...' : '저장하기'}
        </Button>
    );
}
