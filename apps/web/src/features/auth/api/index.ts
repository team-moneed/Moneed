import { RefreshTokenDTO } from '../model';
import { proxy } from '@/shared/api/client';
import { Providers } from '@moneed/auth';
import { User } from '@/entities/user';

export const logout = async ({ provider }: { provider: Providers }) => {
    const res = await proxy.post(`/api/auth/${provider}/logout`);
    return res;
};

export const leave = async ({ provider, reason }: { provider: Providers; reason: string }) => {
    const res = await proxy.post<{ ok: boolean; reason?: string }>(`/api/auth/${provider}/leave`, {
        reason,
    });
    return res;
};

export const refresh = async ({ provider, refreshToken }: { provider: Providers; refreshToken: string | null }) => {
    const res = await proxy.post<RefreshTokenDTO>(
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
        payload: User;
        isNewUser: boolean;
    }>('/api/auth/kakao/exchange', { tempCode });
    return res;
};
