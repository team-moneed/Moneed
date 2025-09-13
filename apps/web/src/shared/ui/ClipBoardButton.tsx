'use client';

import Icon from '@/shared/ui/Icon';
import useSnackbarStore from '@/shared/store/useSnackbarStore';

export default function ClipBoardButton() {
    const { showSnackbar } = useSnackbarStore();

    const handleCopyUrl = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        try {
            const currentUrl = window.location.href;
            await navigator.clipboard.writeText(currentUrl);

            showSnackbar({
                message: 'URL이 클립보드에 복사되었습니다.',
                variant: 'action',
                position: 'bottom',
            });
        } catch (error) {
            console.error('클립보드 복사 실패:', error);
            showSnackbar({
                message: 'URL 복사에 실패했습니다.',
                variant: 'caution',
                position: 'bottom',
            });
        }
    };

    return (
        <button onClick={handleCopyUrl} type='button'>
            <Icon iconUrl='/images/sharingIcon.svg' width={20} height={20} />
        </button>
    );
}
