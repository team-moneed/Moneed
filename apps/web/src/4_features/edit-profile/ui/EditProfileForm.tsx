import SubmitButton from './SubmitButton';
import CancleButton from './CancleButton';
import ShowProfileImageListButton from './ShowProfileImageListButton';
import ProfileImage from './ProfileImage';
import SelectImagePannel from './SelectImagePannel';
import { useOpen } from '@/6_shared/hooks/useOpen';
import { User } from '../api/type';
import NicknameInput from './NicknameInput';
import { updateUserProfile } from '../server/action';
import { useActionState, useState } from 'react';

interface EditProfileFormProps {
    user: User;
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
    const { isOpen, toggle } = useOpen();
    const [nickname, setNickname] = useState(user.nickname);
    const [profileImageUrl, setProfileImageUrl] = useState(user.profileImage);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    // const [state, action, pending] = useActionState(updateUserProfile, false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await updateUserProfile({
            nickname: nickname,
            profileImageFile: profileImageFile,
            profileImageUrl: profileImageUrl,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='flex justify-center items-center rounded-full aspect-square w-56 mx-auto mt-24 relative'>
                <ProfileImage imageUrl={profileImageUrl} />
                <ShowProfileImageListButton onClick={toggle} />
            </div>
            <SelectImagePannel
                isOpen={isOpen}
                onSelectImageFile={setProfileImageFile}
                onSelectImageUrl={setProfileImageUrl}
            />

            <NicknameInput nickname={nickname} onChange={setNickname} />

            <div className='pt-24 flex justify-between gap-[1.6rem]'>
                <CancleButton />
                <SubmitButton />
            </div>
        </form>
    );
}
