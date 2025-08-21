import { searchShorts } from '@/apis/youtube.api';
import { ERROR_MSG } from '@/constants/errorMsg';
import { Shorts } from '@/generated/prisma';
import ShortRepository from '@/repositories/short.repository';
import { parseShorts } from '@/utils/parser';
import { AxiosError } from 'axios';

export default class ShortService {
    private readonly shortRepository = new ShortRepository();
    private totalQuota = 10000;
    private cost = 100;
    private maxCount = 50; // 한 번에 최대 50개 가져오기

    async updateShorts({
        query,
        count = this.maxCount,
        pageToken = '',
        totalQuota = this.totalQuota,
        cost = this.cost,
        isRetry = false, // 재시도 여부 플래그
    }: {
        query: string;
        count?: number;
        pageToken?: string;
        totalQuota?: number;
        cost?: number;
        isRetry?: boolean;
    }) {
        for (let i = 0; i < totalQuota / cost; i++) {
            try {
                const res = await searchShorts({ q: query, count, page: pageToken });
                const data = res.data;
                pageToken = data.nextPageToken;
                const shorts = parseShorts(data);
                await this.shortRepository.upsertShorts({ shorts: shorts as Shorts[] });
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
                        await this.updateShorts({
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

    async getShorts({ cursor, limit }: { cursor: string | null; limit: number }) {
        return await this.shortRepository.getShorts({ cursor, limit });
    }

    async getShortByVideoId({ videoId }: { videoId: string }) {
        return await this.shortRepository.getShortByVideoId({ videoId });
    }
}
