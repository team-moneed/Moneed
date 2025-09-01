/**
 * 시간 단위 문자열을 밀리초로 변환하는 함수
 * @param duration - 시간 단위 문자열 (예: "30m", "1h", "7d")
 * @returns 밀리초 단위의 숫자
 * @throws Error - 유효하지 않은 형식이거나 지원하지 않는 단위인 경우
 */
export function parseDurationToMs(duration: string | number): number {
    if (typeof duration === 'number') {
        return duration;
    }

    const match = duration.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
    if (!match) {
        throw new Error(`Invalid duration format: ${duration}`);
    }

    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();

    const unitMap: Record<string, number> = {
        // seconds
        sec: 1000,
        secs: 1000,
        second: 1000,
        seconds: 1000,
        s: 1000,

        // minutes
        minute: 60 * 1000,
        minutes: 60 * 1000,
        min: 60 * 1000,
        mins: 60 * 1000,
        m: 60 * 1000,

        // hours
        hour: 60 * 60 * 1000,
        hours: 60 * 60 * 1000,
        hr: 60 * 60 * 1000,
        hrs: 60 * 60 * 1000,
        h: 60 * 60 * 1000,

        // days
        day: 24 * 60 * 60 * 1000,
        days: 24 * 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,

        // weeks
        week: 7 * 24 * 60 * 60 * 1000,
        weeks: 7 * 24 * 60 * 60 * 1000,
        w: 7 * 24 * 60 * 60 * 1000,

        // years (365.25 days)
        year: 365.25 * 24 * 60 * 60 * 1000,
        years: 365.25 * 24 * 60 * 60 * 1000,
        yr: 365.25 * 24 * 60 * 60 * 1000,
        yrs: 365.25 * 24 * 60 * 60 * 1000,
        y: 365.25 * 24 * 60 * 60 * 1000,
    };

    const multiplier = unitMap[unit];
    if (multiplier === undefined) {
        throw new Error(`Unsupported time unit: ${unit}`);
    }

    return Math.round(value * multiplier);
}
