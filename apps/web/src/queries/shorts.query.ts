import { fetchShorts, fetchShort } from '@/apis/shorts.api';
import { getMsUntilMidnight } from '@/utils/date';
import { useInfiniteQuery, useQuery, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';

const untilMidnight = getMsUntilMidnight();

export const useShort = ({ videoId = '' }: { videoId?: string }) => {
    return useQuery({
        queryKey: ['short', videoId],
        queryFn: () => fetchShort({ videoId }),
        staleTime: untilMidnight,
        gcTime: untilMidnight,
    });
};

export const useShorts = ({ videoId = '', limit = 10 }: { videoId?: string; limit?: number }) => {
    return useQuery({
        queryKey: ['shorts', videoId, limit],
        queryFn: () => fetchShorts({ cursor: videoId, limit }),
        staleTime: untilMidnight,
        gcTime: untilMidnight,
    });
};

export const useSuspenseShorts = ({ videoId = '', limit = 10 }: { videoId?: string; limit?: number }) => {
    return useSuspenseQuery({
        queryKey: ['shorts', videoId, limit],
        queryFn: () => fetchShorts({ cursor: videoId, limit }),
        staleTime: untilMidnight,
        gcTime: untilMidnight,
    });
};

export const useInfiniteShorts = ({ cursor = '', limit = 20 }: { cursor?: string; limit?: number }) => {
    return useInfiniteQuery({
        queryKey: ['infinite-shorts', cursor, limit],
        queryFn: ({ pageParam = cursor }) => fetchShorts({ cursor: pageParam, limit }),
        initialPageParam: cursor,
        getNextPageParam: lastPage => (lastPage.length > 0 ? lastPage.at(-1)?.videoId : undefined),
        select: data => data.pages.flatMap(page => page),
        staleTime: untilMidnight,
        gcTime: untilMidnight,
    });
};

export const useSuspenseInfiniteShorts = ({ cursor = '', limit = 20 }: { cursor?: string; limit?: number }) => {
    return useSuspenseInfiniteQuery({
        queryKey: ['infinite-shorts', cursor, limit],
        queryFn: ({ pageParam = cursor }) => fetchShorts({ cursor: pageParam, limit }),
        initialPageParam: cursor,
        getNextPageParam: lastPage => (lastPage.length > 0 ? lastPage.at(-1)?.videoId : undefined),
        select: data => data.pages.flatMap(page => page),
        staleTime: untilMidnight,
        gcTime: untilMidnight,
    });
};
