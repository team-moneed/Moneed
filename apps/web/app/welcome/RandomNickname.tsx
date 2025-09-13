'use client';

import type { TokenPayload } from '@moneed/auth';
import { decodeJwt } from 'jose';
import { useEffect, useState } from 'react';
import { TokenUtils } from '@/shared/utils/tokenUtils';

export default function RandomNickname() {
    const [nickname, setNickname] = useState<string>('');

    useEffect(() => {
        const accessToken = TokenUtils.getAccessToken();
        if (!accessToken) {
            return;
        }

        const decoded = decodeJwt<TokenPayload>(accessToken);
        setNickname(decoded.nickname);
    }, []);

    return <span className='text-[#10DBBD]'>[{nickname}]</span>;
}
