'use client';

import { TokenPayload } from '@/types/auth';
import { decodeJwt } from 'jose';
import { getCookie } from '@/utils/cookie';
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
