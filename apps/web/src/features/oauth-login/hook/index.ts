import { useEffect } from 'react';
import useUserStore from '@/entities/user/model/user.store';
import { exchangeTempCode } from '@/features/oauth-login/api';
import { setTokensInCookies } from '@/shared/utils/token.actions';
import { PATH } from '@/shared/config';
import { useRouter } from 'next/navigation';
import TokenLocalStorage from '@/shared/utils/token.localstorage';

export const useExchangeTempCodeAndRedirect = (tempCode: string) => {
    const router = useRouter();
    const setUser = useUserStore(state => state.setUser);

    useEffect(() => {
        if (!tempCode) return;

        exchangeTempCode({ tempCode })
            .then(async data => {
                const { access_token, refresh_token, isNewUser, payload } = data;

                // 로컬스토리지에 저장
                TokenLocalStorage.setTokens(access_token, refresh_token);
                // 전역 상태 저장
                setUser({
                    id: payload.id,
                    nickname: payload.nickname,
                    profileImage: payload.profileImage,
                    provider: payload.provider,
                });
                // 서버 액션으로 쿠키에 저장
                await setTokensInCookies(access_token, refresh_token);
                // 리다이렉트
                if (isNewUser) {
                    router.push(`${PATH.SELECTSTOCKTYPE}?url=${encodeURIComponent(PATH.WELCOME)}`);
                } else {
                    router.push(PATH.HOME);
                }
            })
            .catch(error => {
                console.error('임시 토큰 교환 오류:', error);
                router.push(PATH.ONBOARDING);
            });
    }, [router, setUser, tempCode]);
};
