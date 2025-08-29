import { parseDurationToMs } from '../date';

describe('parseDurationToMs', () => {
    it('숫자 입력값을 그대로 반환한다', () => {
        expect(parseDurationToMs(1500)).toBe(1500);
    });

    it.each([
        ['30s', 30_000],
        ['2m', 120_000],
        ['1h', 3_600_000],
        ['1d', 86_400_000],
        ['1w', 604_800_000],
        ['1y', 31_557_600_000], // 365.25 days
    ])('%s를 %d ms로 파싱한다', (input, expected) => {
        expect(parseDurationToMs(input)).toBe(expected);
    });

    it('잘못된 형식에 대해 에러를 던진다', () => {
        expect(() => parseDurationToMs('abc')).toThrow();
    });

    it('지원하지 않는 단위에 대해 에러를 던진다', () => {
        expect(() => parseDurationToMs('1q')).toThrow();
    });
});
