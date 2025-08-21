import 'server-only';
import { kis } from './server';
import {
    KISAccessTokenResponse,
    OverseasStockConditionSearchResponse,
    MarketCode,
    OverseasStockPriceResponse,
    OverseasStockInfoResponse,
} from '@/types/kis';
import axios from 'axios';

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
export const getOverseasStockByCondition = async ({ market }: { market: MarketCode }) => {
    const response = await kis.get<OverseasStockConditionSearchResponse>(searchByConditionUrl, {
        params: {
            AUTH: '',
            EXCD: market,
            CO_YN_RATE: '1', // 등락율 조건 사용 여부 (1: 사용, 0: 사용안함)
            CO_ST_RATE: '0.1', // 등락율 시작율
            CO_EN_RATE: String(10_000), // 등락율 끝율
            CO_YN_VALX: '1', // 시가총액 조건 사용 여부 (1: 사용, 0: 사용안함)
            CO_ST_VALX: String(50_000_000), // 시가총액 시작값 (단위: 천$) -> 500억$
            CO_EN_VALX: String(5_000_000_000), // 시가총액 끝값 (단위: 천$) -> 5조$
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
