export const ERROR_MSG = {
    YOUTUBE_TOO_MANY_REQUESTS: 'Youtube API 금일 할당량 초과',
    YOUTUBE_SHORTS_UPDATE_UNHANDLED_ERROR: 'Shorts 업데이트 중 예상치 못한 오류 발생',
    SHORT_VIDEO_ID_REQUIRED: '비디오 ID가 필요합니다',
    SHORT_NOT_FOUND: '해당 Short를 찾을 수 없습니다',
    SHORT_FETCH_ERROR: 'Short 조회 중 오류가 발생했습니다',
    TOKEN_EXPIRED: '세션이 만료되었습니다.',
    AUTHORIZATION_HEADER_REQUIRED: 'Authorization 헤더가 필요합니다.',
    SESSION_SECRET_NOT_SET: 'SESSION_SECRET 환경변수가 설정되지 않았습니다',
} as const;
