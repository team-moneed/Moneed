import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    distDir: 'dist',
    eslint: {
        dirs: ['src'],
    },
    devIndicators: false,
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
