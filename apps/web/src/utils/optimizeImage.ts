import imageCompression from 'browser-image-compression';

/**
 * 이미지 압축 옵션 인터페이스
 */
export interface ImageCompressionOptions {
    /** 최대 파일 크기 (MB) */
    maxSizeMB?: number;
    /** 최대 너비 (px) */
    maxWidthOrHeight?: number;
    /** 압축 품질 (0-1) */
    initialQuality?: number;
    /** 파일 타입 */
    fileType?: string;
    /** 압축 시도 횟수 */
    maxIteration?: number;
    /** EXIF 데이터 보존 여부 */
    preserveExif?: boolean;
    /** 진행률 콜백 */
    onProgress?: (progress: number) => void;
}

/**
 * 기본 압축 옵션
 */
const DEFAULT_OPTIONS: Required<Omit<ImageCompressionOptions, 'onProgress'>> = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    initialQuality: 0.8,
    fileType: 'image/jpeg',
    maxIteration: 10,
    preserveExif: false,
};

/**
 * 프리셋 압축 옵션들
 */
export const COMPRESSION_OPTIONS = {
    /** 고품질 (2MB, 1920px, 90% 품질) */
    HIGH_QUALITY: {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        initialQuality: 0.9,
    },
    /** 중간 품질 (1MB, 1280px, 80% 품질) */
    MEDIUM_QUALITY: {
        maxSizeMB: 1,
        maxWidthOrHeight: 1280,
        initialQuality: 0.8,
    },
    /** 저품질 (0.5MB, 720px, 70% 품질) */
    LOW_QUALITY: {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 720,
        initialQuality: 0.7,
    },
    /** 썸네일 (0.2MB, 400px, 60% 품질) */
    THUMBNAIL: {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 400,
        initialQuality: 0.6,
    },
} as const;

/**
 * 이미지 파일을 압축합니다
 * @param file 압축할 이미지 파일
 * @param options 압축 옵션
 * @returns 압축된 파일
 */
export async function compressImage(file: File, options: ImageCompressionOptions = {}): Promise<File> {
    try {
        // 이미지 파일인지 확인
        if (!file.type.startsWith('image/')) {
            throw new Error('이미지 파일만 압축할 수 있습니다.');
        }

        // 옵션 병합
        const compressionOptions = {
            ...DEFAULT_OPTIONS,
            ...options,
        };

        // 이미지 압축 실행
        const compressedFile = await imageCompression(file, compressionOptions);

        return compressedFile;
    } catch (error) {
        console.error('이미지 압축 중 오류가 발생했습니다:', error);
        throw new Error(error instanceof Error ? error.message : '이미지 압축에 실패했습니다.');
    }
}
