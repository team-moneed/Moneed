import ImageInput from './ImageInput';
import ProfileImageList from './ProfileImageList';

interface SelectImagePannelProps {
    isOpen: boolean;
    onSelectImageFile: (file: File) => void;
    onSelectImageUrl: (url: string) => void;
}

export default function SelectImagePannel({ isOpen, onSelectImageFile, onSelectImageUrl }: SelectImagePannelProps) {
    if (!isOpen) return null;

    const handleSelectImage = (profileImageUrl: File | string) => {
        if (profileImageUrl instanceof File) {
            onSelectImageFile(profileImageUrl);
            onSelectImageUrl(URL.createObjectURL(profileImageUrl));
        } else {
            onSelectImageUrl(profileImageUrl);
        }
    };

    return (
        <div className='grid grid-cols-4 p-8 mt-16 gap-x-[3.4rem] gap-y-[2rem] justify-items-center items-center'>
            <ImageInput onSelectImage={handleSelectImage} />
            <ProfileImageList onSelectImage={handleSelectImage} />
        </div>
    );
}
