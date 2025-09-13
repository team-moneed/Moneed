export type SnackbarVariant = 'normal' | 'action' | 'caution';
export type SnackbarPosition = 'top' | 'bottom';

export interface SnackbarAction {
    label: string;
    onClick: () => void;
}

export interface SnackbarConfig {
    id?: string;
    message: string;
    variant: SnackbarVariant;
    position: SnackbarPosition;
    icon?: string;
    action?: SnackbarAction;
    duration?: number; // 밀리초, 0이면 수동으로 닫아야 함
}

export interface SnackbarState {
    snackbars: SnackbarConfig[];
    showSnackbar: (config: SnackbarConfig) => void;
    hideSnackbar: (id: string) => void;
    hideAllSnackbars: () => void;
}
