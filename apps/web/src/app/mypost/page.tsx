'use client';

import { useState } from 'react';
import PostThumbnail from '../community/[symbol]/PostThumbnail';
import { cn } from '@/utils/style';
import { useMyPosts } from '@/queries/posts.query';

export const dynamic = 'force-dynamic';

const MyPost = () => {
    const [activeTab, setActiveTab] = useState<'thisWeek' | 'notThisWeek'>('thisWeek');

    const { data: posts = [], isLoading, error } = useMyPosts();

    const thisweekPosts = posts.filter(post => {
        const now = new Date();
        const postDate = new Date(post.createdAt);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        return postDate >= startOfWeek;
    });

    const currentTabPosts = activeTab === 'thisWeek' ? thisweekPosts : posts;

    if (isLoading) {
        return <div className='px-8 max-w-512 mx-auto'>로딩중...</div>;
    }

    if (error) {
        return <div className='px-8 max-w-512 mx-auto'>게시글을 불러올 수 없습니다.</div>;
    }

    return (
        <>
            <div className='px-8 max-w-512 mx-auto'>
                <div className='flex my-[1.8rem]'>
                    <div className='text-[1.8rem] font-semibold leading-[140%]'>게시글</div>
                    <div className='ml-[.4rem] text-[1.8rem] font-semibold leading-[140%]'>
                        {currentTabPosts.length}
                    </div>
                </div>
                <div className='border-b-2 border-solid border-moneed-gray-5'>
                    <button
                        onClick={() => setActiveTab('thisWeek')}
                        className={cn(
                            'pr-[1.2rem] text-[1.6rem] font-semibold leading-[140%]',
                            activeTab === 'thisWeek'
                                ? 'text-moneed-black border-b-4 border-solid border-moneed-black'
                                : 'text-moneed-gray-7',
                        )}
                    >
                        이번주 게시글
                    </button>
                    <button
                        onClick={() => setActiveTab('notThisWeek')}
                        className={cn(
                            'pr-[1.2rem] text-[1.6rem] font-semibold leading-[140%]',
                            activeTab === 'notThisWeek'
                                ? 'text-moneed-black border-b-4 border-solid border-moneed-black'
                                : 'text-moneed-gray-7',
                        )}
                    >
                        이전 게시글
                    </button>
                </div>
                <div className='flex flex-col mt-[2.4rem] gap-[1.2rem]'>
                    {currentTabPosts.map(post => (
                        <PostThumbnail key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default MyPost;
