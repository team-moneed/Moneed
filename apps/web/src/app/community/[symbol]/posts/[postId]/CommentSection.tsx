'use client';
import { useModal } from '@/context/ModalContext';
import { PrimaryDropdownProps } from '@/components/Dropdown';
import Comment from '@/components/Comment/Comment';
import CommentForm from '@/components/Comment/CommentForm';
import { deleteComment } from '@/apis/comment.api';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/components/QueryClientProvider';
import useSnackbarStore from '@/store/useSnackbarStore';
import { Comment as TComment } from '@/types/post';
import { useCommentStore } from '@/store/useCommentStore';
import { useShallow } from 'zustand/react/shallow';

interface CommentSectionProps {
    postId: string;
    comments: TComment[];
}

export default function CommentSection({ postId, comments }: CommentSectionProps) {
    const { confirm } = useModal();
    const showSnackbar = useSnackbarStore(state => state.showSnackbar);
    const { setEditCommentId, setEditCommentContent, setIsEditingComment } = useCommentStore(
        useShallow(state => ({
            setEditCommentId: state.setEditCommentId,
            setEditCommentContent: state.setEditCommentContent,
            setIsEditingComment: state.setIsEditingComment,
        })),
    );

    const { mutate: deleteCommentMutation } = useMutation({
        mutationFn: deleteComment,
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: ['post', Number(postId)] });
            showSnackbar({
                message: data.message,
                variant: 'action',
                position: 'bottom',
                icon: '',
            });
        },
    });

    const handleEditComment =
        (commentId: number, commentContent: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setIsEditingComment(true);
            setEditCommentContent(commentContent);
            setEditCommentId(commentId);
        };

    //댓글 삭제할건지 묻는 모달
    const openCommentDeletemodal = (commentId: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const result = confirm(
            <span>
                삭제된 내용은 복구되지 않아요.
                <br />
                정말 삭제하실건가요?
            </span>,
        );
        result.then(confirmed => {
            if (confirmed) {
                deleteCommentMutation({ commentId });
            }
        });
    };

    const createCommentDropdownMenus = (
        commentId: number,
        commentContent: string,
    ): PrimaryDropdownProps['dropdownMenus'] => [
        {
            icon: '/icon/icon-scissors.svg',
            text: '댓글 수정',
            onClick: handleEditComment(commentId, commentContent),
        },
        {
            icon: '/icon/icon-trashcan.svg',
            text: '댓글 삭제',
            onClick: openCommentDeletemodal(commentId),
        },
    ];

    return (
        <div className='lg:w-[40%] lg:ml-auto flex flex-col'>
            <div className='order-1 lg:order-2 flex gap-4 py-[1.8rem]'>
                <div className='text-[1.8rem] font-semibold leading-[140%] text-moneed-black'>댓글</div>
                <div className='text-[1.8rem] font-semibold leading-[140%] text-moneed-black'>{comments.length}</div>
            </div>
            <div className='order-2 lg:order-3 flex flex-col gap-[3.6rem]'>
                {comments.length == 0 ? (
                    <div>
                        <div className='flex justify-center items-center mt-8'>
                            <img src='/cta-2.svg' alt='' className='w-116' />
                        </div>
                    </div>
                ) : (
                    comments.map(comment => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            actions={createCommentDropdownMenus(comment.id, comment.content)}
                        ></Comment>
                    ))
                )}
            </div>
            {/* 모바일 UI 수정: 댓글 입력창이 가장 아래에 붙도록*/}
            <div className='order-3 lg:order-1 mt-16 lg:mt-4 relative flex items-center bg-moneed-gray-4 rounded-[1.2rem]'>
                <CommentForm postId={Number(postId)} />
            </div>
        </div>
    );
}
