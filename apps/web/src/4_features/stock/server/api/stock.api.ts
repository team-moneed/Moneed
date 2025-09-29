import 'server-only';
import { kis } from '@/6_shared/api/server';
import {
    KISAccessTokenResponse,
    OverseasStockConditionSearchResponse,
    OverseasStockPriceResponse,
    OverseasStockInfoResponse,
    OverseasStockConditionSearchParams,
} from '../model';
import axios from 'axios';
import { MarketCode } from '@/5_entities/stock';

// 한국 투자증권 API

const accessTokenUrl = '/oauth2/tokenP';
const searchByConditionUrl = '/uapi/overseas-price/v1/quotations/inquire-search';
const overseasStockPriceUrl = '/uapi/overseas-price/v1/quotations/price';
const overseasStockInfoUrl = '/uapi/overseas-price/v1/quotations/search-info';

/**
 * 접근토큰발급(P)[인증-001]
 * {@link https://apiportal.koreainvestment.com/apiservice-apiservice?/oauth2/tokenP API DOCS}
 */
export const getAccessToken = async () => {
    const response = await axios.post<KISAccessTokenResponse>(`${process.env.KIS_BASE_URL}${accessTokenUrl}`, {
        grant_type: 'client_credentials',
        appkey: process.env.KIS_APP_KEY,
        appsecret: process.env.KIS_APP_SECRET,
    });
    return response.data;
};

/**
 * 해외주식조건검색[v1_해외주식-015]
 * {@link https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/overseas-price/v1/quotations/inquire-search API DOCS}
 */
export const getOverseasStockByCondition = async ({
    market,
    params,
}: {
    market: MarketCode;
    params?: Omit<OverseasStockConditionSearchParams, 'AUTH' | 'EXCD'>;
}) => {
    const response = await kis.get<OverseasStockConditionSearchResponse>(searchByConditionUrl, {
        params: {
            AUTH: '',
            EXCD: market,
            ...params,
        },
        headers: {
            tr_id: 'HHDFS76410000',
        },
    });
    return response.data;
};

/**
 * 해외주식 현재체결가[v1_해외주식-009]
 * {@link https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/overseas-price/v1/quotations/price API DOCS}
 */
export const getOverseasStockPrice = async ({ symbol }: { symbol: string }) => {
    const response = await kis.get<OverseasStockPriceResponse>(overseasStockPriceUrl, {
        params: {
            AUTH: '',
            EXCD: 'NAS',
            SYMB: symbol,
        },
        headers: {
            tr_id: 'HHDFS00000300',
        },
    });
    return response.data;
};

/**
 * 해외주식 상품기본정보[v1_해외주식-034]
 * {@link https://apiportal.koreainvestment.com/apiservice-apiservice?/uapi/overseas-price/v1/quotations/search-info API DOCS}
 */
export const getOverseasStockInfo = async ({ symbol }: { symbol: string }) => {
    const response = await kis.get<OverseasStockInfoResponse>(overseasStockInfoUrl, {
        params: {
            PRDT_TYPE_CD: '512', // 상품 유형 코드(512: 미국 나스닥)
            PDNO: symbol,
        },
        headers: {
            tr_id: 'CTPF1702R',
        },
    });
    return response.data;
};
