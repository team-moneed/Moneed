import 'server-only';

// Server-side API functions
export {
    getAccessToken,
    getOverseasStockInfo,
    getOverseasStockPrice,
    getOverseasStockByCondition,
} from './api/stock.server';

// Repository
export { StockRepository } from './repository/stock.server';

// Types (server & shared)
export type {
    MarketCode,
    Stock,
    KISAccessTokenResponse,
    OverseasStockConditionSearchResponse,
    OverseasStockPriceResponse,
    OverseasStockInfoResponse,
} from './model';
