import { UserRepository } from '@/repositories/user.repository';
import { generateRandomNickname, generateRandomNicknameWithNumber } from '@/utils/nickname-generator';

export class NicknameService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    /**
     * 닉네임이 중복되는지 확인합니다.
     * @param nickname 확인할 닉네임
     * @returns 중복 여부 (true: 중복됨, false: 사용 가능)
     */
    async isNicknameDuplicated(nickname: string): Promise<boolean> {
        const existingUser = await this.userRepository.findByNickname(nickname);
        return !!existingUser;
    }

    /**
     * 중복되지 않는 랜덤 닉네임을 생성합니다.
     * @param maxAttempts 최대 시도 횟수 (기본값: 10)
     * @returns 중복되지 않는 고유한 닉네임
     */
    async generateUniqueNickname(maxAttempts: number = 10): Promise<string> {
        // 형용사 + 명사
        for (let i = 0; i < maxAttempts; i++) {
            const nickname = generateRandomNickname();
            const isDuplicated = await this.isNicknameDuplicated(nickname);

            if (!isDuplicated) {
                return nickname;
            }
        }

        // 형용사 + 명사 + 숫자(4자리)
        for (let i = 0; i < maxAttempts; i++) {
            const nickname = generateRandomNicknameWithNumber();
            const isDuplicated = await this.isNicknameDuplicated(nickname);

            if (!isDuplicated) {
                return nickname;
            }
        }

        throw new Error('닉네임 생성 실패');
    }

    /*
     * 사용자 정의 닉네임의 유효성을 검사합니다.
     * @param nickname 검사할 닉네임
     * @returns 유효성 검사 결과
     */
    async validateNickname(nickname: string): Promise<
        | {
              ok: false;
              reason: string;
          }
        | {
              ok: true;
          }
    > {
        // 길이 검사
        if (nickname.length < 2) {
            return {
                ok: false,
                reason: '닉네임은 2글자 이상이어야 합니다.',
            };
        }

        if (nickname.length > 10) {
            return {
                ok: false,
                reason: '닉네임은 10글자 이하여야 합니다.',
            };
        }

        // 특수문자 검사 (한글, 영문, 숫자만 허용)
        const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;
        if (!nicknameRegex.test(nickname)) {
            return {
                ok: false,
                reason: '닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.',
            };
        }

        // 중복 검사
        const isDuplicated = await this.isNicknameDuplicated(nickname);
        if (isDuplicated) {
            return {
                ok: false,
                reason: '이미 사용 중인 닉네임입니다.',
            };
        }

        return {
            ok: true,
        };
    }
}
