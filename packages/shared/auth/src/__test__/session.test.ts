import { describe, test, expect, beforeEach } from '@jest/globals';
import { encrypt, decrypt } from '../session';
import { TokenPayload } from '../types/auth';
import { JWSInvalid, JWTExpired, JWTInvalid } from 'jose/errors';

describe('Session Encryption/Decryption', () => {
    // 고정된 테스트 데이터
    let testPayload: TokenPayload;
    let testKey: string;
    let testExpiration: Date;
    let testJwt: string;

    beforeEach(async () => {
        // Given: 고정된 테스트 데이터
        testPayload = {
            id: 'test-user-123',
            nickname: 'TestUser',
            profileImage: 'test-profile-image',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
        };

        testKey = 'test-secret-key-for-encryption-32-bytes-long!!';
        testExpiration = new Date(Date.now() + 3600 * 1000); // 1시간 후
        testJwt = await encrypt(testPayload, testExpiration, testKey);
    });

    describe('encrypt 단위 테스트', () => {
        test('유효한 페이로드와 키를 전달하면 JWT 토큰을 반환한다.', async () => {
            // When: payload를 encrypt
            const encryptedToken = await encrypt(testPayload, testExpiration, testKey);

            // Then: 반환된 토큰이 유효한 JWT 형식인지 확인
            expect(encryptedToken).toBeDefined();
            expect(typeof encryptedToken).toBe('string');
            expect(encryptedToken.split('.')).toHaveLength(3); // JWT는 3부분으로 구성
        });
    });

    describe('decrypt 단위 테스트', () => {
        test('유효한 토큰을 전달하면 원본 페이로드를 반환한다.', async () => {
            // When: 토큰을 decrypt
            const decryptedPayload = await decrypt<TokenPayload>(testJwt, testKey);

            // Then: 원본 payload와 동일한지 확인
            expect(decryptedPayload.id).toBe(testPayload.id);
            expect(decryptedPayload.nickname).toBe(testPayload.nickname);
            expect(decryptedPayload.exp).toBeDefined();
            expect(decryptedPayload.iat).toBeDefined();
        });

        test('유효하지 않은 토큰을 전달하면 오류를 반환한다.', async () => {
            // When: 유효하지 않은 토큰을 decrypt
            const invalidJwt = 'invalid-jwt-token';
            await expect(decrypt<TokenPayload>(invalidJwt, testKey)).rejects.toThrow(JWSInvalid);
        });

        test('만료된 토큰을 전달하면 오류를 반환한다.', async () => {
            // When: 만료된 토큰을 decrypt
            const expiredJwt = await encrypt(testPayload, new Date(Date.now() - 1000), testKey);
            await expect(decrypt<TokenPayload>(expiredJwt, testKey)).rejects.toThrow(JWTExpired);
        });
    });

    describe('encrypt, decrypt 통합 테스트', () => {
        test('동일한 키로 encrypt와 decrypt를 수행하면 원본 페이로드를 얻을 수 있다.', async () => {
            // 메인 테스트: encrypt -> decrypt 동작 검증
            // When: payload를 encrypt
            const encryptedToken = await encrypt(testPayload, testExpiration, testKey);

            // Then: 결과가 JWT 문자열 형식인지 확인
            expect(encryptedToken).toBeDefined();
            expect(typeof encryptedToken).toBe('string');
            expect(encryptedToken.split('.')).toHaveLength(3); // JWT는 3부분으로 구성

            // When: 동일한 key로 decrypt
            const decryptedPayload = await decrypt<TokenPayload>(encryptedToken, testKey);

            // Then: 원본 payload와 동일한지 확인
            expect(decryptedPayload.id).toBe(testPayload.id);
            expect(decryptedPayload.nickname).toBe(testPayload.nickname);
            expect(decryptedPayload.exp).toBeDefined();
            expect(decryptedPayload.iat).toBeDefined();
        });
    });
});
