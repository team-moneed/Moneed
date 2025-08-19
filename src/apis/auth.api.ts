import { http, httpWithCredentials } from './client';

type KakaoTokenParams = {
    code: string;
    state?: string;
    provider: 'kakao';
};

type KakaoTokenResponse = {
    isExistingUser: boolean;
};

export const login = async ({ code, state, provider }: KakaoTokenParams) => {
    const res = await http.post<KakaoTokenResponse>(`/api/auth/${provider}/login`, { code, state });
    return res.data;
};

export const logout = async ({ provider }: { provider: 'kakao' }) => {
    const res = await httpWithCredentials.post(`/api/auth/${provider}/logout`);
    return res;
};

export const leave = async ({ provider, reason }: { provider: 'kakao'; reason: string }) => {
    const res = await httpWithCredentials.post<{ ok: boolean; reason?: string }>(`/api/auth/${provider}/leave`, {
        reason,
    });
    return res;
};
