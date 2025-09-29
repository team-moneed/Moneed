import { UserRepository } from '@/repository/user.repository';
import { generateRandomNickname, generateRandomNumber } from '@/utils/random';

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
            const nickname = generateRandomNickname() + generateRandomNumber();
            const isDuplicated = await this.isNicknameDuplicated(nickname);

            if (!isDuplicated) {
                return nickname;
            }
        }

        throw new Error('닉네임 생성 실패');
    }
}
