import { JWTPayload } from 'jose';
import { JWTExpired, JWTInvalid } from 'jose/errors';

export type User = {
    id: string;
    nickname: string;
    profileImage: string;
};

export type TokenPayload = User & JWTPayload;

export type DecodedToken = User & {
    exp: number;
    iat: number;
    expiresAt: Date;
};

export type SessionResult =
    | { data: TokenPayload; error: null }
    | { data: null; error: Error | JWTExpired | JWTInvalid };
