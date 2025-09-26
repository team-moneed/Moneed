import { ProviderType } from '@moneed/auth';
import { proxy } from '@/shared/api/client';

export const leave = async ({ provider }: { provider: ProviderType }) => {
    const res = await proxy.post<{ message: string }>(`/api/auth/${provider}/leave`);
    return res;
};
