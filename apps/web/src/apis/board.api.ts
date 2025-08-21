import { BoardRankResponse } from '@/types/board';
import { http } from './client';

export const getBoardRank = async ({ limit }: { limit: number }) => {
    const response = await http.get<BoardRankResponse[]>(`/api/board/rank`, {
        params: {
            limit,
        },
    });
    return response.data;
};
