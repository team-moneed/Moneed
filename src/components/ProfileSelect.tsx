interface ProfileSelectProps {
    onSelect: (image: string) => void;
}

const ProfileSelect = ({ onSelect }: ProfileSelectProps) => {
    const images = [
        '/profile/profile-1.svg',
        '/profile/profile-2.svg',
        '/profile/profile-3.svg',
        '/profile/profile-4.svg',
        '/profile/profile-5.svg',
        '/profile/profile-6.svg',
    ];

    return (
        <div className='grid grid-cols-4 gap-[1rem] mt-[2rem]'>
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Profile ${index + 1}`}
                    className='aspect-[1/1] w-[4.8rem] object-cover cursor-pointer'
                    onClick={() => onSelect(image)}
                />
            ))}
        </div>
    );
};

export default ProfileSelect;
