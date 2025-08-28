import type { Shorts } from '@moneed/db/generated';
import { http } from './client';

export const fetchShorts = async ({ cursor, limit }: { cursor: string; limit: number }) => {
    const res = await http.get<Shorts[]>('/api/shorts', {
        params: {
            cursor,
            limit,
        },
    });

    return res.data;
};

export const fetchShort = async ({ videoId }: { videoId: string }) => {
    const res = await http.get<Shorts>(`/api/shorts/${videoId}`);

    return res.data;
};
