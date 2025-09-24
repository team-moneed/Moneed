import { Suspense } from 'react';

export default function withSuspense<T extends React.ComponentType<any>>(Component: T, fallback: React.ReactNode) {
    return function WithSuspense(props: React.ComponentProps<T>) {
        return (
            <Suspense fallback={fallback}>
                <Component {...props} />
            </Suspense>
        );
    };
}
