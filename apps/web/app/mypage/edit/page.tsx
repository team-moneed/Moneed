'use client';

import EditProfileForm from '@/4_features/edit-profile/ui/EditProfileForm';
import { useSuspenseUserInfo } from '@/4_features/edit-profile/model/query';
import { use, useEffect } from 'react';
import { REASONS } from '@/6_shared/config/snackbar';
import useSnackbarStore from '@/6_shared/store/useSnackbarStore';
import { SnackbarTrigger } from '@/6_shared/ui/Snackbar';

// export const dynamic = 'force-dynamic';

const MyProfile = ({ searchParams }: { searchParams: Promise<{ reason: string }> }) => {
    const { data: user } = useSuspenseUserInfo();
    const { reason } = use(searchParams);

    return (
        <div className='w-full max-w-[480px] px-6 mx-auto'>
            <EditProfileForm user={user} />
            <SnackbarTrigger reason={reason} />
        </div>
    );
};

export default MyProfile;
