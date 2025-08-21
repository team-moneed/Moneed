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

/**
 * 랜덤한 한국어 닉네임을 생성합니다.
 * 형용사 + 명사 조합으로 생성됩니다.
 * @returns 생성된 랜덤 닉네임
 */
export function generateRandomNickname(): string {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective}${randomNoun}`;
}

/**
 * 숫자가 포함된 랜덤 닉네임을 생성합니다.
 * 형용사 + 명사 + 숫자(1000-9999) 조합으로 생성됩니다.
 * @returns 생성된 랜덤 닉네임
 */
export function generateRandomNicknameWithNumber(): string {
    const baseNickname = generateRandomNickname();
    const randomNumber = Math.floor(Math.random() * 9000) + 1000; // 1000-9999

    return `${baseNickname}${randomNumber}`;
}
