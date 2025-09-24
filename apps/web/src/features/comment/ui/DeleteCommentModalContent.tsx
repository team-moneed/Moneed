import Button from '@/shared/ui/Button/Button';
import { useModal } from '@/shared/hooks/useModal';
import { deleteComment } from '@/features/comment/api';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/app/provider/QueryClientProvider';
import useSnackbarStore from '@/shared/store/useSnackbarStore';
import { MODAL_MSG } from '@/shared/config/message';

interface DeleteCommentModalContentProps {
    commentId: number;
    postId: number;
}

export default function DeleteCommentModalContent({ commentId, postId }: DeleteCommentModalContentProps) {
    const { closeModal } = useModal();
    const showSnackbar = useSnackbarStore(state => state.showSnackbar);

    const { mutate: deleteCommentMutation } = useMutation({
        mutationFn: deleteComment,
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
            showSnackbar({
                message: data.message,
                variant: 'action',
                position: 'bottom',
                icon: '',
            });
            closeModal();
        },
    });

    const handleDelete = () => {
        deleteCommentMutation({ commentId });
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
            <h2 className='text-h2 w-full text-center'>댓글을 삭제하시겠어요?</h2>
            <pre className='w-full py-[2rem] px-[2.1rem] rounded-[1.6rem] bg-moneed-shade-bg text-center text-[1.4rem] leading-[142%] mt-[2.4rem]'>
                {MODAL_MSG.DELETE_COMMENT_MODAL_MSG}
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
