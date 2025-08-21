export const ERROR_MSG = {
    YOUTUBE_TOO_MANY_REQUESTS: 'Youtube API 금일 할당량 초과',
    YOUTUBE_SHORTS_UPDATE_UNHANDLED_ERROR: 'Shorts 업데이트 중 예상치 못한 오류 발생',
    SHORT_VIDEO_ID_REQUIRED: '비디오 ID가 필요합니다',
    SHORT_NOT_FOUND: '해당 Short를 찾을 수 없습니다',
    SHORT_FETCH_ERROR: 'Short 조회 중 오류가 발생했습니다',
    KAKAO_INVALID_STATE: '카카오 인증 실패, 잘못된 접근입니다',
    KAKAO_MISSING_CODE: '카카오 인증 실패, 인증 코드가 없습니다',
    KAKAO_INTERNAL_ERROR: '카카오 인증 실패, 서버 오류가 발생했습니다',
    KAKAO_PROVIDER_INFO_NOT_FOUND: '카카오 계정 정보를 찾을 수 없습니다',
    KAKAO_ACCESS_TOKEN_NOT_FOUND: '카카오 인증 정보를 찾을 수 없습니다',
} as const;

export const AUTH_ERROR_PATHS = {
    INVALID_STATE: '/auth/error?error=invalid_state',
    MISSING_CODE: '/auth/error?error=missing_code',
    INTERNAL_ERROR: '/auth/error?error=internal_error',
} as const;
