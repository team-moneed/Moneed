import Icon from '../Icon';
import CommentSkeleton from './CommentSkeleton';

export default function PostDetailSkeleton() {
    return (
        <div className='px-8 max-w-512 mx-auto'>
            {/* 큰 화면에서 제목 */}
            <div className='hidden lg:block font-semibold leading-[140%] text-[1.6rem] ml-[.4rem] text-moneed-gray-9 mb-4'>
                <div className='w-48 h-6 bg-moneed-gray-4 rounded animate-pulse'></div>
            </div>

            <div className='lg:flex gap-12'>
                {/* 왼쪽 영역 - 게시글 내용 */}
                <div className='lg:w-[60%] lg:border lg:border-moneed-gray-4 rounded-[1.2rem] lg:p-8'>
                    <div className='pb-[1.3rem] pt-[1.4rem]'>
                        {/* 사용자 프로필 영역 */}
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-[.6rem]'>
                                <div className='rounded-full overflow-hidden aspect-square w-[3.2rem] bg-moneed-gray-4 animate-pulse'></div>
                                <div className='w-20 h-[1.6rem] bg-moneed-gray-4 rounded animate-pulse'></div>
                                <i className='w-[.2rem] h-[.2rem] rounded-full bg-moneed-gray-5'></i>
                                <div className='w-16 h-[1.6rem] bg-moneed-gray-4 rounded animate-pulse'></div>
                            </div>
                            <Icon iconUrl='/icon/icon-more.svg' width={24} height={24} className='animate-pulse' />
                        </div>

                        {/* 게시글 제목 */}
                        <div className='mt-[2.4rem]'>
                            <div className='w-full h-6 bg-moneed-gray-4 rounded animate-pulse mb-2'></div>
                            <div className='w-3/4 h-6 bg-moneed-gray-4 rounded animate-pulse'></div>
                        </div>

                        {/* 게시글 내용 */}
                        <div className='mt-[2.4rem] mb-[.8rem] space-y-2'>
                            <div className='w-full h-5 bg-moneed-gray-4 rounded animate-pulse'></div>
                            <div className='w-full h-5 bg-moneed-gray-4 rounded animate-pulse'></div>
                            <div className='w-full h-5 bg-moneed-gray-4 rounded animate-pulse'></div>
                            <div className='w-2/3 h-5 bg-moneed-gray-4 rounded animate-pulse'></div>
                        </div>
                    </div>

                    {/* 좋아요/댓글/공유 버튼들 */}
                    <div className='flex items-center gap-4 pb-[1.6rem] pt-[.4rem]'>
                        <div className='w-[2.4rem] h-[2.4rem] bg-moneed-gray-4 rounded animate-pulse'></div>
                        <div className='w-[2.4rem] h-[2.4rem] bg-moneed-gray-4 rounded animate-pulse'></div>
                        <div className='w-[2.4rem] h-[2.4rem] bg-moneed-gray-4 rounded animate-pulse'></div>
                    </div>
                </div>

                {/* 오른쪽 영역 - 댓글 */}
                <div className='lg:w-[40%] lg:ml-auto flex flex-col'>
                    {/* 댓글 제목과 개수 */}
                    <div className='order-1 lg:order-2 flex gap-4 py-[1.8rem]'>
                        <div className='w-12 h-[1.8rem] bg-moneed-gray-4 rounded animate-pulse'></div>
                    </div>

                    {/* 댓글 목록 */}
                    <div className='order-2 lg:order-3 flex flex-col gap-[3.6rem]'>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <CommentSkeleton key={index} />
                        ))}
                    </div>

                    {/* 댓글 입력창 */}
                    <div className='w-full h-[5.2rem] order-3 lg:order-1 mt-16 lg:mt-4 relative flex items-center bg-moneed-gray-4 rounded-[1.2rem]'>
                        <div className='absolute right-4 rounded-full size-[3.6rem] bg-moneed-gray-6 animate-pulse'></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
