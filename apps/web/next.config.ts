import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    eslint: {
        dirs: ['src', 'app'],
    },
    devIndicators: false,
    transpilePackages: ['@moneed/db', '@moneed/auth', '@moneed/utils', '@moneed/utility-types'],
    images: {
        localPatterns: [
            {
                pathname: 'public/**',
            },
        ],
        remotePatterns: [
            new URL(`https://${process.env.AWS_BUCKET_URL || ''}`),
            {
                protocol: 'https',
                hostname: '**.ytimg.com',
            },
        ],
    },
};

export default nextConfig;
