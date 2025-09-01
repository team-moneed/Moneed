/**
 * 특정 프로퍼티만 옵셔널로 만드는 유틸리티 타입
 * @example
 * type UserWithOptionalFields = MakeOptional<User, 'ageRange' | 'gender'>;
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
