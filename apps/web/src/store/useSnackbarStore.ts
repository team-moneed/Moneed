import { create } from 'zustand';
import { SnackbarConfig, SnackbarState } from '@/types/snackbar';

export const generateId = () => Math.random().toString(36).substring(2, 9); // uuid 생성

const useSnackbarStore = create<SnackbarState>((set, get) => ({
    snackbars: [],
    showSnackbar: config => {
        const id = config.id ?? generateId();
        const snackbar: SnackbarConfig = {
            ...config,
            id,
            duration: config.duration ?? 3000, // 기본 3초
        };

        set(state => ({
            snackbars: [...state.snackbars, snackbar],
        }));

        // 일정 시간 뒤에 자동으로 닫기
        if (snackbar.duration && snackbar.duration > 0) {
            setTimeout(() => {
                get().hideSnackbar(id);
            }, snackbar.duration);
        }
    },
    hideSnackbar: id => {
        set(state => ({
            snackbars: state.snackbars.filter(snackbar => snackbar.id !== id),
        }));
    },
    hideAllSnackbars: () => {
        set({ snackbars: [] });
    },
}));

export default useSnackbarStore;
