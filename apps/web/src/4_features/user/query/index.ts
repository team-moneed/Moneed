import { useInfiniteQuery, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { userApi } from '../api';

export const useUser = () => {
    return useQuery({
        queryKey: ['myInfo'],
        queryFn: () => userApi.fetchInfo(),
    });
};

export const useSuspenseUser = () => {
    return useSuspenseQuery({
        queryKey: ['myInfo'],
        queryFn: () => userApi.fetchInfo(),
    });
};

export const useMyPosts = () => {
    return useQuery({
        queryKey: ['myPosts'],
        queryFn: () => userApi.fetchPosts(),
    });
};

export const useSuspenseMyPosts = () => {
    return useSuspenseQuery({
        queryKey: ['myPosts'],
        queryFn: () => userApi.fetchPosts(),
    });
};

export const useMyStocks = ({ accessToken }: { accessToken: boolean }) => {
    return useQuery({
        queryKey: ['myStocks'],
        queryFn: () => userApi.fetchStocks(),
        retry: (failureCount, error: any) => {
            // 401 에러인 경우 재시도하지 않음
            if (error?.response?.status === 401) {
                return false;
            }
            // 다른 에러의 경우 최대 3번 재시도
            return failureCount < 3;
        },
        enabled: !!accessToken,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });
};

export const useInfiniteMyStocks = ({ count = 20, enabled }: { count?: number; enabled: boolean }) => {
    return useInfiniteQuery({
        queryKey: ['myStocks', 'infinite'],
        queryFn: ({ pageParam = 0 }) => userApi.fetchStocks({ count, cursor: pageParam }),
        getNextPageParam: lastPage => (lastPage.length > 0 ? lastPage.at(-1)?.id : undefined),
        initialPageParam: 0,
        select: data => data.pages.flatMap(page => page),
        retry: (failureCount, error: any) => {
            // 401 에러인 경우 재시도하지 않음
            if (error?.response?.status === 401) {
                return false;
            }
            // 다른 에러의 경우 최대 3번 재시도
            return failureCount < 3;
        },
        enabled: enabled,
    });
};

export const useMyComments = () => {
    return useQuery({
        queryKey: ['myComments'],
        queryFn: () => userApi.fetchComments(),
    });
};
