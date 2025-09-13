import { ERROR_MSG } from '@moneed/auth';
import type { SessionResult } from '@moneed/auth';
import { verifyToken } from '@moneed/auth';
import { Request } from 'express';

export async function verifyRequestTokens(req: Request): Promise<SessionResult> {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
        return {
            data: null,
            error: new Error(ERROR_MSG.NO_ACCESS_TOKEN),
        };
    }
    return await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET! });
}
