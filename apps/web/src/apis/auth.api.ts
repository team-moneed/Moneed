import { Providers } from '@moneed/shared-types';
import { auth, authWithCredentials } from './client';

type KakaoTokenParams = {
    code: string;
    state?: string;
    provider: 'kakao';
};

type KakaoTokenResponse = {
    isExistingUser: boolean;
};

export const getAuthCode = async ({ provider }: { provider: Providers }) => {
    const res = await auth.get<{ url: string }>(`/api/auth/${provider}/login`);
    return res.data;
};

export const login = async ({ code, state, provider }: KakaoTokenParams) => {
    const res = await auth.post<KakaoTokenResponse>(`/api/auth/${provider}/login`, { code, state });
    return res.data;
};

export const logout = async ({ provider }: { provider: 'kakao' }) => {
    const res = await authWithCredentials.post(`/api/auth/${provider}/logout`);
    return res;
};

export const leave = async ({ provider, reason }: { provider: 'kakao'; reason: string }) => {
    const res = await authWithCredentials.post<{ ok: boolean; reason?: string }>(`/api/auth/${provider}/leave`, {
        reason,
    });
    return res;
};
