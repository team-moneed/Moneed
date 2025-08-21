import Button from '../Button';

export const MyProfileSkeleton = () => {
    return (
        <div className='w-full max-w-[480px] px-6 mx-auto'>
            <div className='flex justify-center items-center rounded-full aspect-square w-56 mx-auto mt-24 relative'>
                <div className='w-full h-full object-cover rounded-full bg-moneed-gray-4 animate-pulse' />
                <div className='absolute bottom-[0rem] right-2 size-[3.6rem] bg-moneed-gray-4 rounded-full'></div>
            </div>

            <div>
                <div className='text-[1.6rem] font-normal leading-[140%] text-moneed-black mt-[6.9rem]'>닉네임</div>
                <div className='bg-moneed-gray-4 text-[1.6rem] rounded-[1.2rem] px-[2.4rem] py-[.8rem] h-[5.4rem] w-full animate-pulse' />
            </div>

            <div className='pt-24 flex justify-between'>
                <Button
                    disabled={true}
                    variant='secondary'
                    className='text-[1.6rem] font-bold leading-[140%] px-[2.4rem] py-[1.8rem] animate-pulse border-none'
                >
                    취소
                </Button>
                <Button
                    variant='primary'
                    className='text-[1.6rem] font-bold leading-[140%] px-58 py-[1.8rem] animate-pulse'
                    disabled={true}
                >
                    저장하기
                </Button>
            </div>
        </div>
    );
};
