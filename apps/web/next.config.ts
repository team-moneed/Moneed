import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    distDir: 'dist',
    eslint: {
        dirs: ['src'],
    },
    devIndicators: false,
    transpilePackages: ['@moneed/db', '@moneed/auth', '@moneed/utils', '@moneed/utility-types'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.AWS_BUCKET_URL ?? '',
            },
        ],
    },
};

export default nextConfig;
