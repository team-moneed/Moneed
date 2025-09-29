import { CommunityDTO } from '@/4_features/community/model';
import { http } from '../../../6_shared/api/client';

export const getBoardRank = async ({ limit }: { limit: number }) => {
    const response = await http.get<CommunityDTO[]>(`/api/board/rank`, {
        params: {
            limit,
        },
    });
    return response.data;
};
