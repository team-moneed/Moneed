import { useRef, useState } from 'react';
import useSnackbarStore from '@/store/useSnackbarStore';
import { createComment, updateComment } from '@/apis/comment.api';
import { queryClient } from '@/components/QueryClientProvider';
import { useMutation } from '@tanstack/react-query';
import { useCommentStore } from '@/store/useCommentStore';

type CommentFormProps = {
    postId: number;
};

export default function CommentForm({ postId }: CommentFormProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { isEditingComment, setIsEditingComment, editCommentId, editCommentContent, setEditCommentContent } =
        useCommentStore();
    const [newComment, setNewComment] = useState('');
    const { mutate: createCommentMutation } = useMutation({
        mutationFn: createComment,
        onSuccess: data => {
            showSnackbar({
                message: data.message,
                variant: 'action',
                position: 'bottom',
                icon: '',
            });
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
            setNewComment('');
        },
    });

    const { mutate: updateCommentMutation } = useMutation({
        mutationFn: updateComment,
        onSuccess: data => {
            showSnackbar({
                message: data.message,
                variant: 'action',
                position: 'bottom',
                icon: '',
            });
            queryClient.invalidateQueries({ queryKey: ['post', Number(postId)] });
            setEditCommentContent('');
            setIsEditingComment(false);
        },
    });

    const showSnackbar = useSnackbarStore(state => state.showSnackbar);

    //댓글 추가/수정 창
    const handleWriteComment = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isEditingComment) {
            setEditCommentContent(e.target.value);
        } else {
            setNewComment(e.target.value);
        }

        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            window.scrollTo({
                top: scrollTop + rect.top - window.innerHeight / 3,
                behavior: 'smooth',
            });
        }
    };

    //댓글 수정/삭제 후  제출
    const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const currentContent = isEditingComment ? editCommentContent : newComment;
        if (currentContent.trim() === '') {
            showSnackbar({
                message: '댓글을 입력해주세요.',
                variant: 'caution',
                position: 'top',
            });
            return;
        }
        if (isEditingComment && editCommentId) {
            updateCommentMutation({ commentId: editCommentId, content: currentContent });
        } else {
            createCommentMutation({ postId, content: currentContent });
        }
    };
    return (
        <form onSubmit={handleSubmitComment} className='flex items-center w-full'>
            <input
                ref={inputRef}
                type='text'
                onChange={handleWriteComment}
                className='bg-transparent text-[1.6rem] text-moneed-black placeholder:text-moneed-gray-7 px-[1.8rem] py-[1.2rem] w-full focus:outline-none'
                placeholder='의견을 공유해보세요.(최대 300자)'
                value={isEditingComment ? editCommentContent : newComment}
            />
            <button
                className='absolute right-4 rounded-full aspect-square w-[3.6rem] bg-moneed-gray-6 cursor-pointer hover:bg-moneed-brand'
                type='submit'
            >
                <img src='/icon/icon-submit-comment.svg' alt='submit' className='p-[.6rem]' />
            </button>
        </form>
    );
}
