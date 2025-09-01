'use client';
import { useMutation } from '@tanstack/react-query';
import Icon from '../Icon';
import { likePost, unlikePost } from '@/apis/post.api';
import { queryClient } from '../QueryClientProvider';

export default function PostLikeButton({
    postId,
    isLiked,
    likeCount,
}: {
    postId: number;
    isLiked: boolean;
    likeCount: number;
}) {
    const { mutate: likePostMutation } = useMutation({
        mutationFn: likePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
        },
    });

    const { mutate: unlikePostMutation } = useMutation({
        mutationFn: unlikePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['post', postId] });
        },
    });

    const toggleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isLiked) {
            unlikePostMutation({ postId });
        } else {
            likePostMutation({ postId });
        }
    };

    return (
        <button className='flex items-center gap-[.4rem]' type='button' onClick={toggleLike}>
            <Icon iconUrl={isLiked ? '/redHeartIcon.svg' : '/heartIcon.svg'} width={18} height={18}></Icon>
            <span className='mr-4 text-[1.4rem] font-normal leading-[140%] text-moneed-gray-8'>{likeCount}</span>
        </button>
    );
}
