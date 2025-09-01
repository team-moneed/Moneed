import { SnackbarConfig } from '@/types/snackbar';

export const REASON_CODES = {
    LOGGED_IN: 'logged_in',
    NO_SESSION: 'no_session',
    EXPIRED_SESSION: 'expired_session',
    LOGOUT: 'logout',
    LEAVE: 'leave',
    POST_CREATED: 'post_created',
    POST_DELETED: 'post_deleted',
    POST_UPDATED: 'post_updated',
    PROFILE_UPDATED: 'profile_updated',
};

export const REASONS: Record<string, SnackbarConfig> = {
    logged_in: { message: '이미 로그인 상태입니다.', variant: 'normal', position: 'top' },
    no_session: { message: '로그인이 필요합니다.', variant: 'caution', position: 'top' },
    expired_session: {
        message: '세션이 만료되었습니다. 다시 로그인해주세요.',
        variant: 'caution',
        position: 'top',
    },
    logout: { message: '로그아웃 되었습니다.', variant: 'action', position: 'top' },
    leave: { message: '탈퇴가 완료되었습니다.', variant: 'action', position: 'top' },
    post_created: { message: '게시글이 작성되었습니다.', variant: 'action', position: 'bottom' },
    post_deleted: { message: '게시글이 삭제되었습니다.', variant: 'action', position: 'bottom' },
    post_updated: { message: '게시글이 수정되었습니다.', variant: 'action', position: 'bottom' },
    profile_updated: { message: '프로필이 변경되었습니다.', variant: 'action', position: 'bottom' },
};
