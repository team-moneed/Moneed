'use client';

import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
    return <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>;
}
