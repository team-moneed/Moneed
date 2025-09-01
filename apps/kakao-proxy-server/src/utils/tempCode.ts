import { randomBytes } from 'crypto';

interface TempCodeData {
    accessToken: string;
    refreshToken: string;
    payload: any;
    isNewUser: boolean;
    createdAt: number;
}

// 메모리에 임시 코드 저장 (운영환경에서는 Redis 사용 권장)
const tempCodes = new Map<string, TempCodeData>();

// 임시 코드 만료 시간 (5분)
const TEMP_CODE_EXPIRES_IN = 5 * 60 * 1000;

/**
 * 임시 코드 생성
 */
export const generateTempCode = (data: Omit<TempCodeData, 'createdAt'>): string => {
    const tempCode = randomBytes(32).toString('hex');

    tempCodes.set(tempCode, {
        ...data,
        createdAt: Date.now(),
    });

    // 만료된 코드들 정리
    cleanupExpiredCodes();

    return tempCode;
};

/**
 * 임시 코드로 데이터 조회 및 삭제 (한 번만 사용 가능)
 */
export const consumeTempCode = (tempCode: string): TempCodeData | null => {
    const data = tempCodes.get(tempCode);

    if (!data) {
        return null;
    }

    // 만료 체크
    if (Date.now() - data.createdAt > TEMP_CODE_EXPIRES_IN) {
        tempCodes.delete(tempCode);
        return null;
    }

    // 사용 후 삭제
    tempCodes.delete(tempCode);

    return data;
};

/**
 * 만료된 임시 코드들 정리
 */
const cleanupExpiredCodes = () => {
    const now = Date.now();

    for (const [code, data] of tempCodes.entries()) {
        if (now - data.createdAt > TEMP_CODE_EXPIRES_IN) {
            tempCodes.delete(code);
        }
    }
};

// 주기적으로 만료된 코드들 정리 (10분마다)
setInterval(cleanupExpiredCodes, 10 * 60 * 1000);
