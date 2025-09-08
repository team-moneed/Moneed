import { KakaoRefreshTokenResponse } from '@/types/auth';
import { proxy, proxyWithCredentials } from '../shared/api/client';
import { Providers } from '@moneed/auth';

export const logout = async ({ provider }: { provider: Providers }) => {
    const res = await proxyWithCredentials.post(`/api/auth/${provider}/logout`);
    return res;
};

export const leave = async ({ provider, reason }: { provider: Providers; reason: string }) => {
    const res = await proxyWithCredentials.post<{ ok: boolean; reason?: string }>(`/api/auth/${provider}/leave`, {
        reason,
    });
    return res;
};

export const refresh = async ({ provider, refreshToken }: { provider: Providers; refreshToken: string }) => {
    const res = await proxy.post<KakaoRefreshTokenResponse>(
        `/api/auth/${provider}/refresh`,
        {},
        {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        },
    );
    return res;
};

export const exchangeTempCode = async ({ tempCode }: { tempCode: string }) => {
    const res = await proxy.post<{
        access_token: string;
        refresh_token: string;
        payload: any;
        isNewUser: boolean;
    }>('/api/auth/kakao/exchange', { tempCode });
    return res;
};
