export const ERROR_MSG = {
    KAKAO_INVALID_STATE: '카카오 인증 실패, 잘못된 접근입니다',
    KAKAO_MISSING_CODE: '카카오 인증 실패, 인증 코드가 없습니다',
    KAKAO_INTERNAL_ERROR: '카카오 인증 실패, 서버 오류가 발생했습니다',
    KAKAO_PROVIDER_INFO_NOT_FOUND: '카카오 계정 정보를 찾을 수 없습니다',
    KAKAO_ACCESS_TOKEN_NOT_FOUND: '카카오 인증 정보를 찾을 수 없습니다',
    SESSION_SECRET_NOT_SET: 'SESSION_SECRET 환경변수가 설정되지 않았습니다',
    ACCESS_TOKEN_EXPIRED: '액세스 토큰이 만료되었습니다',
    REFRESH_TOKEN_EXPIRED: '리프레시 토큰이 만료되었습니다',
    ACCESS_TOKEN_INVALID: '액세스 토큰이 유효하지 않습니다',
    REFRESH_TOKEN_INVALID: '리프레시 토큰이 유효하지 않습니다',
} as const;

export const AUTH_ERROR_PATHS = {
    INVALID_STATE: '/auth/error?error=invalid_state',
    MISSING_CODE: '/auth/error?error=missing_code',
    INTERNAL_ERROR: '/auth/error?error=internal_error',
} as const;

export const SUCCESS_MSG = {
    LOGOUT: '로그아웃 성공',
    LEAVE: '탈퇴 성공',
} as const;
