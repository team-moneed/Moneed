import ImageUploader from '../ImageUploader';

interface SelectProfileImageProps {
    onSelect: (img: string) => void;
    setPreviewUrl: (url: string | null) => void;
    setImage: (image: File | null) => void;
}

const SelectProfileImage = ({ onSelect, setPreviewUrl, setImage }: SelectProfileImageProps) => {
    const profileImages = Array.from(
        { length: 15 },
        (_, i) => `${process.env.NEXT_PUBLIC_MONEED_BASE_URL}/profile/profile-${i + 1}.svg`,
    );

    return (
        <div className='grid grid-cols-4 p-8 mt-16 gap-x-[3.4rem] gap-y-[2rem] justify-items-center items-center'>
            <ImageUploader
                setImage={setImage}
                setPreviewUrl={setPreviewUrl}
                className='flex justify-center items-center rounded-full bg-moneed-gray-5 p-[1.2rem] size-[4.8rem]'
            />
            {profileImages.map((img, index) => (
                <img
                    key={index}
                    src={img}
                    alt={`Profile ${index + 1}`}
                    className='size-[4.8rem] object-cover rounded-full cursor-pointer border border-solid border-moneed-gray-4 hover:border-moneed-brand'
                    onClick={() => onSelect(img)}
                />
            ))}
        </div>
    );
};

export default SelectProfileImage;
