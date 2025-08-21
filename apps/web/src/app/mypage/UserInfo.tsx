import UserInfoSkeleton from '@/components/Skeletons/mypage/UserInfoSkeleton';
import { useSuspenseUser } from '@/queries/user.query';
import Link from 'next/link';
import withSuspense from '@/components/HOC/withSuspense';

function UserInfo() {
    const { data: user } = useSuspenseUser();

    return (
        <section className='p-[1.6rem] justify-center items-center rounded-[1.6rem] border border-solid border-moneed-gray-5'>
            <div className='flex justify-center'>
                <div className='rounded-full overflow-hidden aspect-square w-[5.6rem]'>
                    <img src={user.profileImage} alt='profile' className='w-full h-full object-cover' />
                </div>
            </div>
            <div className='flex gap-4 justify-center items-center'>
                <div className='text-[2rem] my-[.8rem] font-bold leading-[145%] text-moneed-brand'>{user.nickname}</div>
                <Link className='aspect-square w-[2.4rem] cursor-pointer' href='myprofile'>
                    <img src='/icon/icon-setting.svg' alt='setting' className='w-full h-full' />
                </Link>
            </div>
            <div className='text-center text-[1.4rem] font-normal leading-[145%] text-moneed-gray-7'>
                연동된 계정: 카카오
            </div>
        </section>
    );
}

export default withSuspense(UserInfo, <UserInfoSkeleton />);
