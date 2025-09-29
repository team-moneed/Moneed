import Button from '@/6_shared/ui/Button/Button';
import { useModal } from '@/6_shared/hooks/useModal';
import { useRouter } from 'next/navigation';
import { deletePost } from '@/4_features/post/api';
import { DYNAMIC_PATH, REASON_CODES } from '@/6_shared/config';
import { MODAL_MSG } from '@/6_shared/config/message';

interface DeletePostModalContentProps {
    postId: number;
    stockSymbol: string;
}

// TODO: 디자인 수정
export default function DeletePostModalContent({ postId, stockSymbol }: DeletePostModalContentProps) {
    const { closeModal } = useModal();
    const router = useRouter();

    const handleDelete = async () => {
        await deletePost({ postId });
        router.push(DYNAMIC_PATH.COMMUNITY_SYMBOL(stockSymbol) + `?reason=${REASON_CODES.POST_DELETED}`);
        closeModal();
    };

    const handleCancel = () => {
        closeModal();
    };

    return (
        <div
            className={
                'bg-white w-200 h-176 px-[2rem] pt-[2.8rem] pb-[2.4rem] rounded-t-[1.6rem] sm:rounded-[1.6rem] shadow-lg transform transition-transform duration-300 translate-y-0'
            }
        >
            <h2 className='text-h2 w-full text-center'>게시글을 삭제하시겠어요?</h2>
            <pre className='w-full py-[2rem] px-[2.1rem] rounded-[1.6rem] bg-moneed-shade-bg text-center text-[1.4rem] leading-[142%] mt-[2.4rem]'>
                {MODAL_MSG.DELETE_POST_MODAL_MSG}
            </pre>

            <div className='mt-[2.4rem] flex flex-col justify-center items-center w-full gap-[.8rem]'>
                <Button
                    variant='primary'
                    className='text-[1.6rem] font-bold leading-[140%] px-24 py-[1.2rem] lg:px-58 lg:py-[1.8rem] w-full'
                    onClick={handleCancel}
                >
                    취소
                </Button>
                <Button
                    variant='secondary'
                    className='text-[1.6rem] font-bold leading-[140%] px-24 py-[1.2rem] lg:px-58 lg:py-[1.8rem] w-full'
                    onClick={handleDelete}
                >
                    삭제하기
                </Button>
            </div>
        </div>
    );
}
