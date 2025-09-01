import { fetchMyInfo, fetchMyComments, fetchMyPosts } from '@/apis/user.api';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

export const useUser = () => {
    return useQuery({
        queryKey: ['user', 'me'],
        queryFn: () => fetchMyInfo(),
    });
};

export const useSuspenseUser = () => {
    return useSuspenseQuery({
        queryKey: ['user', 'me'],
        queryFn: () => fetchMyInfo(),
    });
};

export const useUserPosts = () => {
    return useSuspenseQuery({
        queryKey: ['user', 'me', 'posts'],
        queryFn: () => fetchMyPosts(),
    });
};
export const useUserComments = () => {
    return useSuspenseQuery({
        queryKey: ['user', 'me', 'comments'],
        queryFn: () => fetchMyComments(),
    });
};
