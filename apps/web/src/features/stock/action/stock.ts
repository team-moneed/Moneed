'use server';

import { getOverseasStockByCondition } from '@/entities/stock/server';
import { StockService } from '@/features/stock/service';
import { verifyRequestCookies } from '@/shared/utils/server';
import { ResponseError } from '@moneed/utils';
import { ERROR_MSG, SUCCESS_MSG } from '@/shared/config/message';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
/**
 * 시가총액 상위 주식 조회
 * @param param0 count: 조회할 주식 개수 (최대 100개)
 * @returns 시가총액 상위 주식 목록
 */
export const getHotStocks = async ({ count }: { count: number }) => {
    const data = await getOverseasStockByCondition({
        market: 'NAS',
        params: {
            CO_YN_VALX: '1', // 시가총액 조건 사용 여부 (1: 사용, 0: 사용안함)
            CO_ST_VALX: String(0), // 시가총액 시작값 (단위: 천$) -> 500억$
            CO_EN_VALX: String(5_000_000_000), // 시가총액 끝값 (단위: 천$) -> 5조$
        },
    });

    const stocks = data.output2.slice(0, count);
    const stockService = new StockService();

    return await stockService.convertMultipleApiStocks(stocks);
};

/**
 * 사용자가 선택한 주식 심볼 목록 조회 (Server Action)
 * @param params
 * @returns 선택된 주식 심볼 목록 또는 에러 정보
 */
export const getSelectedStockSymbols = async (): Promise<
    | { success: true; data: string[]; error: null }
    | { success: false; data: null; error: { message: string; status: number } }
> => {
    try {
        const { accessTokenPayload } = await verifyRequestCookies();

        if (!accessTokenPayload) {
            throw new ResponseError(401, ERROR_MSG.UNAUTHORIZED);
        }

        const stockService = new StockService();
        const symbols = await stockService.getSelectedStockSymbols(accessTokenPayload.userId);

        return {
            success: true,
            data: symbols,
            error: null,
        };
    } catch (error) {
        if (error instanceof ResponseError) {
            return {
                success: false,
                data: null,
                error: {
                    message: error.message,
                    status: error.code,
                },
            };
        }
        return {
            success: false,
            data: null,
            error: {
                message: ERROR_MSG.INTERNAL_SERVER_ERROR,
                status: 500,
            },
        };
    }
};

/**
 * 주식 선택 (Server Action)
 * @param stockSymbols 선택할 주식 심볼 목록
 * @param redirectUrl 선택 완료 후 리다이렉트할 URL
 * @returns 성공/실패 결과 또는 리다이렉트
 */
export const selectStockAction = async (
    stockSymbols: string[],
    redirectUrl?: string,
): Promise<
    | { success: true; message: string; error: null }
    | { success: false; message: null; error: { message: string; status: number } }
> => {
    let success = false;
    try {
        const { accessTokenPayload } = await verifyRequestCookies();

        if (!accessTokenPayload) {
            throw new ResponseError(401, ERROR_MSG.UNAUTHORIZED);
        }

        const stockService = new StockService();
        await stockService.selectStock(accessTokenPayload.userId, stockSymbols);

        success = true;

        return {
            success,
            message: SUCCESS_MSG.STOCKS_SELECTED,
            error: null,
        };
    } catch (error) {
        success = false;
        if (error instanceof ResponseError) {
            return {
                success,
                message: null,
                error: {
                    message: error.message,
                    status: error.code,
                },
            };
        }
        return {
            success,
            message: null,
            error: {
                message: ERROR_MSG.INTERNAL_SERVER_ERROR,
                status: 500,
            },
        };
    } finally {
        if (redirectUrl && success) {
            revalidatePath(decodeURIComponent(redirectUrl));
            redirect(decodeURIComponent(redirectUrl));
        }
    }
};
