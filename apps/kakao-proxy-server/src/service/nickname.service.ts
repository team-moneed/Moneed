import { UserRepository } from '@/repository/user.repository';

const adjectives = [
    '행복한',
    '똑똑한',
    '용감한',
    '착한',
    '재미있는',
    '귀여운',
    '멋진',
    '빠른',
    '강한',
    '부지런한',
    '친절한',
    '밝은',
    '따뜻한',
    '시원한',
    '달콤한',
    '신나는',
    '평화로운',
    '활발한',
    '조용한',
    '차분한',
    '웃긴',
    '신기한',
    '특별한',
    '소중한',
    '예쁜',
    '잘생긴',
    '건강한',
    '깨끗한',
    '새로운',
    '오래된',
    '큰',
    '작은',
    '높은',
    '낮은',
    '길쭉한',
    '동글동글한',
    '반짝이는',
    '투명한',
    '화려한',
    '심플한',
];

const nouns = [
    '사자',
    '호랑이',
    '곰',
    '토끼',
    '강아지',
    '고양이',
    '펭귄',
    '코끼리',
    '기린',
    '판다',
    '늑대',
    '여우',
    '다람쥐',
    '햄스터',
    '고슴도치',
    '돌고래',
    '고래',
    '상어',
    '물고기',
    '새',
    '독수리',
    '부엉이',
    '참새',
    '비둘기',
    '까마귀',
    '학',
    '백조',
    '오리',
    '닭',
    '병아리',
    '나무',
    '꽃',
    '별',
    '달',
    '해',
    '구름',
    '바람',
    '물',
    '불',
    '얼음',
    '산',
    '바다',
    '강',
    '호수',
    '섬',
    '길',
    '집',
    '성',
    '탑',
    '다리',
];

export class NicknameService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    /**
     * 랜덤한 한국어 닉네임을 생성합니다.
     * 형용사 + 명사 조합으로 생성됩니다.
     * @returns 생성된 랜덤 닉네임
     */
    private generateRandomNickname(): string {
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

        return `${randomAdjective}${randomNoun}`;
    }

    /**
     * 숫자가 포함된 랜덤 닉네임을 생성합니다.
     * 형용사 + 명사 + 숫자(1000-9999) 조합으로 생성됩니다.
     * @returns 생성된 랜덤 닉네임
     */
    private generateRandomNicknameWithNumber(): string {
        const baseNickname = this.generateRandomNickname();
        const randomNumber = Math.floor(Math.random() * 9000) + 1000; // 1000-9999

        return `${baseNickname}${randomNumber}`;
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
            const nickname = this.generateRandomNickname();
            const isDuplicated = await this.isNicknameDuplicated(nickname);

            if (!isDuplicated) {
                return nickname;
            }
        }

        // 형용사 + 명사 + 숫자(4자리)
        for (let i = 0; i < maxAttempts; i++) {
            const nickname = this.generateRandomNicknameWithNumber();
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
