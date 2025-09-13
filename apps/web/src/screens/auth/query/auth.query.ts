import { useQuery } from '@tanstack/react-query';
import { exchangeTempCode } from '@/features/auth/api';

export const useTempCodeAuth = (tempCode: string) => {
    return useQuery({
        queryKey: ['tempCodeAuth', tempCode],
        queryFn: () => exchangeTempCode({ tempCode }),
        enabled: !!tempCode,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        select: data => data.data,
    });
};
