import type { Shorts } from '@prisma/client';
import { http } from '../shared/api/client';

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
