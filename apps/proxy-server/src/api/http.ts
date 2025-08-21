import axios, { AxiosError } from 'axios';
import { refreshKakaoToken } from './kakao.api';
import { ProviderRepository } from 'apps/proxy-server/src/repository/provider.repository';
import { deleteSession } from '@/lib/session';

const getKakaoInstance = () => {
    const instance = axios.create();
    const providerRepository = new ProviderRepository();

    instance.interceptors.request.use(async config => {
        try {
            if (config.headers.Authorization) {
                const token = (config.headers.Authorization as string).split(' ')[1];
                const providerData = await providerRepository.getTokenExpiration('kakao', token);
                if (providerData) {
                    const isAcessTokenExpired = providerData.accessTokenExpiresIn < new Date();
                    const isRefreshTokenExpired = providerData.refreshTokenExpiresIn < new Date();

                    if (!isAcessTokenExpired && !isRefreshTokenExpired) {
                        config.headers.Authorization = `Bearer ${providerData.accessToken}`;
                        return config;
                    } else if (isAcessTokenExpired) {
                        const newToken = await refreshKakaoToken(providerData.refreshToken);
                        config.headers.Authorization = `Bearer ${newToken.access_token}`;
                        await providerRepository.updateTokenData(
                            {
                                provider: 'kakao',
                                providerUserId: providerData.providerUserId,
                            },
                            {
                                accessToken: newToken.access_token,
                                refreshToken: newToken.refresh_token,
                                accessTokenExpiresIn: new Date(Date.now() + newToken.expires_in * 1000),
                                refreshTokenExpiresIn: newToken.refresh_token_expires_in
                                    ? new Date(Date.now() + newToken.refresh_token_expires_in * 1000)
                                    : undefined,
                            },
                        );
                        return config;
                    } else if (isRefreshTokenExpired) {
                        await providerRepository.delete('kakao', providerData.providerUserId);
                        await deleteSession();
                        return Promise.reject(new AxiosError('Token expired'));
                    }
                }
                return config;
            }
            return Promise.reject(new AxiosError('Authorization header is required'));
        } catch (error) {
            console.error('Failed to get Kakao token expiration:', (error as AxiosError).response?.data);
            return Promise.reject(error);
        }
    });

    instance.interceptors.response.use(response => {
        try {
            return response;
        } catch (error) {
            console.error('Failed to get Kakao token expiration:', (error as AxiosError).response?.data);
            return Promise.reject(error);
        }
    });

    return instance;
};

export const kakao = getKakaoInstance();
