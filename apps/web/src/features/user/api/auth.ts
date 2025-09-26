import { RefreshTokenDTO } from '../model';
import { proxy } from '@/shared/api/client';
import { ProviderType, TokenPayload } from '@moneed/auth';

export const logout = async ({ provider }: { provider: ProviderType }) => {
    const res = await proxy.post(`/api/auth/${provider}/logout`);
    return res;
};

export const leave = async ({ provider }: { provider: ProviderType }) => {
    const res = await proxy.post<{ ok: boolean; reason?: string }>(`/api/auth/${provider}/leave`);
    return res;
};

export const refresh = async ({ provider, refreshToken }: { provider: ProviderType; refreshToken: string | null }) => {
    const res = await proxy.post<RefreshTokenDTO>(
        `/api/auth/${provider}/refresh`,
        {},
        {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        },
    );
    return res.data;
};

export const exchangeTempCode = async ({ tempCode }: { tempCode: string }) => {
    const res = await proxy.post<{
        access_token: string;
        refresh_token: string;
        payload: TokenPayload;
        isNewUser: boolean;
    }>('/api/auth/kakao/exchange', { tempCode });
    return res;
};
