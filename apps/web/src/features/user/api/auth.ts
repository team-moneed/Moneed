import { RefreshTokenDTO } from '../model';
import { proxy } from '@/shared/api/client';
import { ProviderType, TokenPayload } from '@moneed/auth';

export const logout = async ({ provider }: { provider: ProviderType }) => {
    const res = await proxy.post(`/api/auth/${provider}/logout`);
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
