import { fetchHotPosts, fetchTopBoardPosts, fetchPosts, fetchTopPosts, fetchPost, fetchPostComments } from '../api';
import { useQuery, useSuspenseInfiniteQuery, useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';
import { Comment } from '@/5_entities/comment/model';
import useUserStore from '@/5_entities/user/model/user.store';

export const useSuspenseHotPosts = () => {
    const user = useUserStore(state => state.user);
    return useSuspenseInfiniteQuery({
        queryKey: ['hot-posts', user?.id],
        queryFn: ({ pageParam = null }) =>
            fetchHotPosts({ limit: 15, cursor: pageParam ?? undefined, userId: user?.id }),
        getNextPageParam: lastPage => (lastPage.length > 0 ? lastPage.at(-1)!.score : null),
        initialPageParam: null as number | null,
        select: data => data.pages.flat(),
    });
};

export const useTop3Posts = ({ symbol, staleTime = 0 }: { symbol: string; staleTime?: number }) => {
    const user = useUserStore(state => state.user);
    return useSuspenseQuery({
        queryKey: ['top3-posts', symbol, user?.id],
        queryFn: () => fetchTopBoardPosts({ symbol, limit: 3, userId: user?.id }),
        staleTime,
    });
};

export const useInfinitePosts = ({ symbol }: { symbol: string }) => {
    const user = useUserStore(state => state.user);
    return useSuspenseInfiniteQuery({
        queryKey: ['posts', symbol, user?.id],
        queryFn: ({ pageParam }) => fetchPosts({ symbol, cursor: pageParam, userId: user?.id }),
        getNextPageParam: lastPage =>
            lastPage?.length > 0 ? new Date(lastPage[lastPage.length - 1].createdAt) : undefined,
        initialPageParam: new Date(),
        select: data => data.pages.flatMap(page => page),
    });
};

export const useTopPosts = ({ limit = 5 }: { limit: number }) => {
    const user = useUserStore(state => state.user);
    return useSuspenseQuery({
        queryKey: ['top-posts', user?.id],
        queryFn: () => fetchTopPosts({ limit }),
    });
};

export const useSuspensePost = ({ postId }: { postId: number }) => {
    const user = useUserStore(state => state.user);
    return useSuspenseQuery({
        queryKey: ['post', postId],
        queryFn: () => fetchPost({ postId, userId: user?.id }),
        staleTime: 0,
        gcTime: 0,
    });
};

export const usePostComments = ({ postId }: { postId: number }) => {
    const { data, isLoading, error } = useQuery<Comment[]>({
        queryKey: ['post-comments', postId],
        queryFn: () => fetchPostComments({ postId }),
    });
    return { data, isLoading, error };
};

export const useSuspensePostWithComments = ({ postId }: { postId: number }) => {
    const user = useUserStore(state => state.user);
    return useSuspenseQueries({
        queries: [
            {
                queryKey: ['post', postId],
                queryFn: () => fetchPost({ postId, userId: user?.id }),
                staleTime: 0,
                gcTime: 0,
            },
            {
                queryKey: ['post-comments', postId],
                queryFn: () => fetchPostComments({ postId }),
            },
        ],
    });
};
