import { Optional } from './util';

export interface KakaoUserInfo {
    id: bigint;
    connected_at: string;
    synched_at: string;
    properties: {
        nickname: string;
        profile_image: string;
        thumbnail_image: string;
    };
    kakao_account: {
        profile: {
            nickname: string;
            thumbnail_image_url: string;
            profile_image_url: string;
        };
        age_range: string;
        gender: 'male' | 'female';
        name: string;
        email: string;
        birthyear: string;
        birthday: string;
    };
}

export interface KakaoTokenResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    refresh_token_expires_in: number;
    id_token: string;
}

export type KakaoRefreshTokenResponse = Optional<KakaoTokenResponse, 'refresh_token' | 'refresh_token_expires_in'>;
