'use client';

import type { TokenPayload } from '@moneed/auth';
import { decodeJwt } from 'jose';
import { useEffect, useState } from 'react';
import TokenLocalStorage from '@/shared/utils/token.localstorage';

export default function RandomNickname() {
    const [nickname, setNickname] = useState<string>('');

    useEffect(() => {
        const accessToken = TokenLocalStorage.getToken(process.env.NEXT_PUBLIC_JWT_ACCESS_NAME || 'access_token');
        if (!accessToken) {
            return;
        }

        const decoded = decodeJwt<TokenPayload>(accessToken);
        setNickname(decoded.nickname);
    }, []);

    return <span className='text-[#10DBBD]'>[{nickname}]</span>;
}
