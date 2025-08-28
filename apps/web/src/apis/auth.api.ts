import { KakaoRefreshTokenResponse } from '@/types/auth';
import { proxy, proxyWithCredentials } from './client';
import { Providers } from '@moneed/auth';

export const logout = async ({ provider }: { provider: Providers }) => {
    const res = await proxy.post(`/api/auth/${provider}/logout`);
    return res;
};

export const leave = async ({ provider, reason }: { provider: Providers; reason: string }) => {
    const res = await proxyWithCredentials.post<{ ok: boolean; reason?: string }>(`/api/auth/${provider}/leave`, {
        reason,
    });
    return res;
};

export const refresh = async ({ provider }: { provider: Providers }) => {
    const res = await proxyWithCredentials.post<KakaoRefreshTokenResponse>(`/api/auth/${provider}/refresh`);
    return res;
};
