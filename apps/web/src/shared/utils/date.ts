export const changeFormatDate = (createdAt: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

    // 30초 이내
    if (diffInSeconds <= 30) {
        return 'Just Now';
    }

    // 30초 이후 ~ 1시간 이내
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}분 전`;
    }

    // 1시간 이후 ~ 24시간 이내
    const diffInHours = Math.floor(diffInSeconds / 3600);
    if (diffInHours < 24) {
        return `${diffInHours}시간 전`;
    }

    // 24시간 이후 ~ 7일 이전
    const diffInDays = Math.floor(diffInSeconds / 86400);
    if (diffInDays < 7) {
        return `${diffInDays}일 전`;
    }

    // 7일 이후 ~ 14일 전
    if (diffInDays >= 7 && diffInDays < 14) {
        return '일주일 전';
    }

    // 14일 이후 ~ 21일 전
    if (diffInDays >= 14 && diffInDays < 21) {
        return '2주 전';
    }

    // 21일 이후 ~ 28일 전
    if (diffInDays >= 21 && diffInDays < 28) {
        return '3주 전';
    }

    // 28일 이후 ~ 60일 전
    if (diffInDays >= 28 && diffInDays < 60) {
        return '한달 전';
    }

    // 60일 이후 ~ 365일 전
    if (diffInDays >= 60 && diffInDays < 365) {
        const month = new Date(createdAt).getMonth() + 1;
        const day = new Date(createdAt).getDate();
        return `${month}월 ${day}일`;
    }

    // 이전 년도
    const year = new Date(createdAt).getFullYear();
    const month = new Date(createdAt).getMonth() + 1;
    const day = new Date(createdAt).getDate();
    return `${year}년 ${month}월 ${day}일`;
};

export const getMsUntilMidnight = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - Date.now();
};
