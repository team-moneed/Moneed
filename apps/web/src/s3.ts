import { S3Client } from '@aws-sdk/client-s3';

export const S3 = new S3Client({
    region: process.env.AWS_REGION || 'ap-northeast-2',
    credentials: {
        accessKeyId: process.env.MONEED_AWS_ACCESS_KEY || '',
        secretAccessKey: process.env.MONEED_AWS_SECRET_KEY || '',
    },
});
