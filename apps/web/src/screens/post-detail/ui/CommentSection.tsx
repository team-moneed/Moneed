'use client';
import { useModal } from '@/shared/hooks/useModal';
import { PrimaryDropdownProps } from '@/shared/ui/Dropdown';
import Comment from '@/entities/comment/ui/Comment';
import CommentForm from '@/entities/comment/ui/CommentForm';
import DeleteCommentModalContent from '@/features/comment/ui/DeleteCommentModalContent';
import type { Comment as TComment } from '@/entities/comment';
import { useCommentStore } from '@/shared/store/useCommentStore';
import { useShallow } from 'zustand/react/shallow';

interface CommentSectionProps {
    postId: number;
    comments: TComment[];
}

export default function CommentSection({ postId, comments }: CommentSectionProps) {
    const { openModal } = useModal();
    const { setEditCommentId, setEditCommentContent, setIsEditingComment } = useCommentStore(
        useShallow(state => ({
            setEditCommentId: state.setEditCommentId,
            setEditCommentContent: state.setEditCommentContent,
            setIsEditingComment: state.setIsEditingComment,
        })),
    );

    const handleEditComment =
        (commentId: number, commentContent: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setIsEditingComment(true);
            setEditCommentContent(commentContent);
            setEditCommentId(commentId);
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
            onClick: () => openModal(<DeleteCommentModalContent commentId={commentId} postId={postId} />),
        },
    ];

    return (
        <div className='sm:w-[40%] sm:ml-auto flex flex-col'>
            <div className='order-1 lg:order-2 flex gap-4 py-[1.8rem]'>
                <div className='text-[1.8rem] font-semibold leading-[140%] text-moneed-black'>댓글</div>
                <div className='text-[1.8rem] font-semibold leading-[140%] text-moneed-black'>{comments.length}</div>
            </div>
            <div className='order-2 sm:order-3 flex flex-col gap-[3.6rem]'>
                {comments.length == 0 ? (
                    <div>
                        <div className='flex justify-center items-center mt-8'>
                            <img src='/images/cta-2.svg' alt='no comments' className='w-116' />
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
            <div className='order-3 sm:order-1 mt-16 sm:mt-4 relative flex items-center bg-moneed-gray-4 rounded-[1.2rem]'>
                <CommentForm postId={postId} />
            </div>
        </div>
    );
}
