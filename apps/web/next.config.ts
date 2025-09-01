import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    eslint: {
        dirs: ['src'],
    },
    devIndicators: false,
    transpilePackages: ['@moneed/db', '@moneed/auth', '@moneed/utils', '@moneed/utility-types'],
    images: {
        remotePatterns: process.env.AWS_BUCKET_URL
            ? [
                  {
                      protocol: 'https',
                      hostname: process.env.AWS_BUCKET_URL,
                  },
              ]
            : [],
    },
};

export default nextConfig;
