import { fetchMyComments } from '@/api/user.api';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useMyComments = () => {
    return useSuspenseQuery({
        queryKey: ['user', 'me', 'comments'],
        queryFn: () => fetchMyComments(),
    });
};
