import { searchShorts } from '@/4_features/update-youtube-shorts/api';
import { ERROR_MSG } from '@/6_shared/config/message';
import { AxiosError } from 'axios';
import UpdateShortsRepository from './repository';

type UpdateShortsParams = {
    query: string;
    count?: number;
    pageToken?: string;
    totalQuota?: number;
    cost?: number;
    isRetry?: boolean;
};

export default class UpdateShortsService {
    private static maxCount = 50;
    private static totalQuota = 10000;
    private static cost = 100;

    static async updateShorts({
        query,
        count = UpdateShortsService.maxCount,
        pageToken = '',
        totalQuota = UpdateShortsService.totalQuota,
        cost = UpdateShortsService.cost,
        isRetry = false, // 재시도 여부 플래그
    }: UpdateShortsParams) {
        for (let i = 0; i < totalQuota / cost; i++) {
            try {
                const shorts = await searchShorts({ q: query, count, page: pageToken });
                await UpdateShortsRepository.upsertShorts(shorts);
                if (!pageToken) {
                    console.log(`쇼츠 업데이트 완료: ${i + 1}회 요청, 총 ${(i + 1) * count}개 동영상`);
                    break;
                }
            } catch (error) {
                // 요청 한도 초과시
                if (error instanceof AxiosError && error.response?.status === 403) {
                    console.log(`쇼츠 업데이트 완료: ${i}회 요청, 총 ${i * count}개 동영상`);
                } else {
                    console.error(ERROR_MSG.YOUTUBE_SHORTS_UPDATE_UNHANDLED_ERROR, error);
                    console.log('현재 페이지 토큰', pageToken);

                    // 재시도 (한 번만 허용)
                    if (!isRetry) {
                        await UpdateShortsService.updateShorts({
                            query,
                            count,
                            pageToken, // 실패한 페이지 토큰부터 진행
                            totalQuota,
                            cost,
                            isRetry: true,
                        });
                    }
                }
                break;
            }
        }
    }
}
