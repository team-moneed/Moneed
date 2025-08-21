export enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
}

export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    data?: any;
    service?: string;
}

export class Logger {
    private level: LogLevel;
    private service: string;

    constructor(service: string = 'moneed', level: LogLevel = LogLevel.INFO) {
        this.service = service;
        this.level = level;
    }

    private log(level: LogLevel, message: string, data?: any) {
        if (level > this.level) return;

        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            service: this.service,
            ...(data && { data }),
        };

        const levelName = LogLevel[level];
        const emoji = this.getLevelEmoji(level);

        console.log(`${emoji} [${levelName}] ${this.service}: ${message}`, data ? data : '');
    }

    private getLevelEmoji(level: LogLevel): string {
        switch (level) {
            case LogLevel.ERROR:
                return '❌';
            case LogLevel.WARN:
                return '⚠️';
            case LogLevel.INFO:
                return 'ℹ️';
            case LogLevel.DEBUG:
                return '🐛';
            default:
                return '📝';
        }
    }

    error(message: string, data?: any) {
        this.log(LogLevel.ERROR, message, data);
    }

    warn(message: string, data?: any) {
        this.log(LogLevel.WARN, message, data);
    }

    info(message: string, data?: any) {
        this.log(LogLevel.INFO, message, data);
    }

    debug(message: string, data?: any) {
        this.log(LogLevel.DEBUG, message, data);
    }

    setLevel(level: LogLevel) {
        this.level = level;
    }

    setService(service: string) {
        this.service = service;
    }
}

// 기본 로거 인스턴스들
export const webLogger = new Logger('web');
export const proxyLogger = new Logger('proxy-server');


