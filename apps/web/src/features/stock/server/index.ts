import 'server-only';

// Server-side API functions
export {
    getAccessToken,
    getOverseasStockInfo,
    getOverseasStockPrice,
    getOverseasStockByCondition,
} from './api/stock.api';

// Repository
export { StockRepository } from './repository/stock.repository';

// Service
export { StockService } from './service/stock.service';

// Types (server & shared)
export type {
    KISAccessTokenResponse,
    OverseasStockConditionSearchResponse,
    OverseasStockPriceResponse,
    OverseasStockInfoResponse,
} from './model';
