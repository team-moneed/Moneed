/**
 * 특정 프로퍼티만 옵셔널로 만드는 유틸리티 타입
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 특정 프로퍼티만 필수로 만드는 유틸리티 타입
 */
export type Required<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;
