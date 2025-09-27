'use client';
import OAuthLoginButton from '@/features/oauth-login/ui/OAuthLoginButton';
import KakaoLogo from '@/screens/onboarding/ui/KakaoLogo';

export default function KakaoLoginButton() {
    const url = process.env.NEXT_PUBLIC_KAKAO_PROXY_SERVER + '/api/auth/kakao/login';

    return <OAuthLoginButton url={url} logo={<KakaoLogo />} text='카카오로 시작하기' />;
}
