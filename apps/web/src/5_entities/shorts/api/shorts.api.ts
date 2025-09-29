import type { Shorts } from '@prisma/client';
import { http } from '@/6_shared/api/client';
import { toShorts } from './mapper';

export const fetchShorts = async ({ cursor, limit }: { cursor: string; limit: number }) => {
    const res = await http.get<Shorts[]>('/api/shorts', {
        params: {
            cursor,
            limit,
        },
    });

    return res.data.map(toShorts);
};

export const fetchShort = async ({ videoId }: { videoId: string }) => {
    const res = await http.get<Shorts>(`/api/shorts/${videoId}`);

    return toShorts(res.data);
};
