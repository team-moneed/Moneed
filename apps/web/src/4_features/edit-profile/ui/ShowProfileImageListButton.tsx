import Image from 'next/image';
import plusIcon from 'public/icon/plus.svg';

interface ShowProfileImageListButtonProps {
    onClick: () => void;
}
export default function ShowProfileImageListButton({ onClick }: ShowProfileImageListButtonProps) {
    return (
        <button
            type='button'
            onClick={onClick}
            className='absolute bottom-[0rem] right-2 bg-moneed-white border border-solid border-moneed-gray-5 rounded-full p-[0.6rem] cursor-pointer '
        >
            <Image src={plusIcon} alt='프로필 이미지 목록 표시 버튼' className='w-full h-full object-cover' />
        </button>
    );
}
