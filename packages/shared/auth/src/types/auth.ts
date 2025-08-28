import { JWTPayload } from 'jose';
import type { UserInfo } from '@moneed/db';

export type TokenPayload = { userId: string; nickname: string } & JWTPayload;

export type DecodedToken = UserInfo & {
    exp: number;
    iat: number;
    expiresAt: Date;
};

export type ProviderInfo = {
    provider: string;
    providerUserId: string;
};

export type Providers = 'kakao';

export type SessionResult =
    | { isExpired: false; isInvalid: false; payload: TokenPayload }
    | { isExpired: true; isInvalid: false; payload: null }
    | { isExpired: false; isInvalid: true; payload: null };
