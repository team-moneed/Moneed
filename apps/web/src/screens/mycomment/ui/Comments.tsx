'use client';

import { useState } from 'react';
import Comment from '@/entities/comment/ui/Comment';
import { useMyComments } from '@/features/user/query';
import { cn } from '@/shared/utils/style';
import { DYNAMIC_PATH } from '@/shared/config';
import { useRouter } from 'next/navigation';
import { useCommentStore } from '@/shared/store/useCommentStore';
import { useShallow } from 'zustand/react/shallow';
import { PrimaryDropdownProps } from '@/shared/ui/Dropdown';
import { CommentWithUserDTO } from '@/features/comment/model/comment.type';
import { useModal } from '@/shared/hooks/useModal';
import DeleteCommentModalContent from '@/features/comment/ui/DeleteCommentModalContent';

// TODO: 로직은 User가 맞지만 UI 자체는 Comment에 가까움
export default function Comments() {
    const [activeTab, setActiveTab] = useState<'thisWeek' | 'notThisWeek'>('thisWeek');
    const { openModal } = useModal();
    const router = useRouter();
    const { setEditCommentId, setIsEditingComment, setEditCommentContent } = useCommentStore(
        useShallow(state => ({
            setEditCommentId: state.setEditCommentId,
            setIsEditingComment: state.setIsEditingComment,
            setEditCommentContent: state.setEditCommentContent,
        })),
    );

    const { data: comments } = useMyComments();

    const thisweekComments = comments.filter(comment => {
        const now = new Date();
        const commentDate = new Date(comment.createdAt);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        return commentDate >= startOfWeek;
    });

    const currentTabComments = activeTab === 'thisWeek' ? thisweekComments : comments;

    //댓글 삭제할건지 묻는 모달
    const openCommentDeletemodal = (commentId: number, postId: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        openModal(<DeleteCommentModalContent commentId={commentId} postId={postId} />);
    };

    const commentDropdownMenus = (comment: CommentWithUserDTO): PrimaryDropdownProps['dropdownMenus'] => [
        {
            icon: '/icon/icon-scissors.svg',
            text: '댓글 수정',
            onClick: () => {
                setIsEditingComment(true);
                setEditCommentId(comment.id);
                setEditCommentContent(comment.content);
                router.push(DYNAMIC_PATH.POST_DETAIL(comment.postId));
            },
        },
        {
            icon: '/icon/icon-trashcan.svg',
            text: '댓글 삭제',
            onClick: openCommentDeletemodal(comment.id, comment.postId),
        },
    ];

    return (
        <>
            <div className='flex my-[1.8rem]'>
                <div className='text-[1.8rem] font-semibold leading-[140%]'>댓글</div>
                <div className='ml-[.4rem] text-[1.8rem] font-semibold leading-[140%]'>{currentTabComments.length}</div>
            </div>
            <div className='border-b-2 border-solid border-moneed-gray-5'>
                <button
                    onClick={() => setActiveTab('thisWeek')}
                    className={cn(
                        'pr-[1.2rem] text-[1.6rem] font-semibold leading-[140%]',
                        activeTab === 'thisWeek'
                            ? 'text-moneed-black border-b-4 border-solid border-moneed-black'
                            : 'text-moneed-gray-7',
                    )}
                >
                    이번주 게시글
                </button>
                <button
                    onClick={() => setActiveTab('notThisWeek')}
                    className={cn(
                        'pr-[1.2rem] text-[1.6rem] font-semibold leading-[140%]',
                        activeTab === 'notThisWeek'
                            ? 'text-moneed-black border-b-4 border-solid border-moneed-black'
                            : 'text-moneed-gray-7',
                    )}
                >
                    이전 게시글
                </button>
            </div>
            <div className='pt-[1.8rem]'>
                {currentTabComments.map(comment => (
                    <div key={comment.id} className='pt-[1.8rem]'>
                        <Comment comment={comment} actions={commentDropdownMenus(comment)} />
                    </div>
                ))}
                {currentTabComments.length === 0 && (
                    <div className='text-[1.6rem] font-normal leading-[140%] text-moneed-gray-7'>
                        최근에 작성한 댓글이 없어요
                    </div>
                )}
            </div>
        </>
    );
}
