import { JWTPayload } from 'jose';

export type TokenPayload = { userId: string; nickname: string } & JWTPayload;

export type User = {
    id: string;
    nickname: string;
    profileImage: string;
};

export type DecodedToken = User & {
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
    | { isExpired: false; isInvalid: true; payload: null }
    | { isExpired: true; isInvalid: true; payload: null };
