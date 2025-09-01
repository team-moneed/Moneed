'use client';

import { ReactQueryDevtools as ReactQueryDevtoolsOriginal } from '@tanstack/react-query-devtools';
import { queryClient } from './QueryClientProvider';

export default function ReactQueryDevtools() {
    return (
        <div style={{ fontSize: '1.6rem' }}>
            <ReactQueryDevtoolsOriginal client={queryClient} initialIsOpen={false} />
        </div>
    );
}
