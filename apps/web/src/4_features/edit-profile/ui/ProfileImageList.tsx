import Image from 'next/image';

interface ProfileImageListProps {
    onSelectImage: (profileImageUrl: File | string) => void;
}

export default function ProfileImageList({ onSelectImage }: ProfileImageListProps) {
    const profileImages = Array.from({ length: 15 }, (_, i) => `/profile/profile-${i + 1}.svg`);

    return (
        <>
            {profileImages.map((img, index) => (
                <Image
                    key={index}
                    src={img}
                    alt={`프로필 ${index + 1}`}
                    className='object-cover rounded-full cursor-pointer border border-solid border-moneed-gray-4 hover:border-moneed-brand'
                    onClick={() => onSelectImage(img)}
                    width={48}
                    height={48}
                />
            ))}
        </>
    );
}
