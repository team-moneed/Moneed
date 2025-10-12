import Image from 'next/image';

interface ProfileImageProps {
    imageUrl: string;
}

export default function ProfileImage({ imageUrl }: ProfileImageProps) {
    return (
        <Image
            src={imageUrl}
            alt='프로필 이미지'
            width={140}
            height={140}
            className='object-cover rounded-full'
            priority
        />
    );
}
