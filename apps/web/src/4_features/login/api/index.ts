import { proxy } from '@/6_shared/api/client';
import { TokenPayload } from '@moneed/auth';

export const exchangeTempCode = async ({ tempCode }: { tempCode: string }) => {
    const res = await proxy.post<{
        access_token: string;
        refresh_token: string;
        payload: TokenPayload;
        isNewUser: boolean;
    }>('/api/auth/kakao/exchange', { tempCode });
    return res.data;
};
