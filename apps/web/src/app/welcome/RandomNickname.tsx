'use client';

import type { TokenPayload } from '@moneed/auth';
import { decodeJwt } from 'jose';
import { getCookie } from '@/shared/utils/cookie.browser';
import { useEffect, useState } from 'react';

export default function RandomNickname() {
    const [nickname, setNickname] = useState<string>('');

    useEffect(() => {
        const accessToken = getCookie('access_token');
        if (!accessToken) {
            return;
        }

        const decoded = decodeJwt<TokenPayload>(accessToken);
        setNickname(decoded.nickname);
    }, []);

    return <span className='text-[#10DBBD]'>[{nickname}]</span>;
}
