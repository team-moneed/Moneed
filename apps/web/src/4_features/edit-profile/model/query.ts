import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchUserInfo } from '../api';

export const useSuspenseUserInfo = () => {
    return useSuspenseQuery({
        queryKey: ['myInfo'],
        queryFn: () => fetchUserInfo(),
    });
};
