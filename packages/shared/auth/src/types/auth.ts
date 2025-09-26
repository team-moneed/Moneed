import { JWTPayload } from 'jose';
import { JWTExpired, JWTInvalid } from 'jose/errors';

export type User = {
    id: string;
    nickname: string;
    profileImage: string;
    provider: ProviderType;
};

export const Provider = {
    KAKAO: 'kakao',
} as const;

export type ProviderType = (typeof Provider)[keyof typeof Provider];

export type TokenPayload = User & JWTPayload;

export type DecodedToken = User & {
    exp: number;
    iat: number;
    expiresAt: Date;
};

export type SessionResult =
    | { data: TokenPayload; error: null }
    | { data: null; error: Error | JWTExpired | JWTInvalid };
