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
