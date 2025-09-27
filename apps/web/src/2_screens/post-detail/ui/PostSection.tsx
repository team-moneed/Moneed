'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useModal } from '@/6_shared/hooks/useModal';
import DateFormatter from '@/6_shared/ui/Dateformatter';
import { PrimaryDropdown, PrimaryDropdownProps } from '@/6_shared/ui/Dropdown';
import Image from 'next/image';
import { DYNAMIC_PATH } from '@/6_shared/config';
import DeletePostModalContent from '@/4_features/post/ui/DeletePostModalContent';
import PostLikeButton from '@/4_features/post/ui/PostLikeButton';
import CommentIcon from '@/5_entities/comment/ui/CommentIcon';
import ClipBoardButton from '@/6_shared/ui/ClipBoardButton';
import { Post } from '@/5_entities/post';

interface PostSectionProps {
    post: Post;
    commentsCount: number;
}

export default function PostSection({ post, commentsCount }: PostSectionProps) {
    const { id, author, stock, title, content, createdAt, isLiked, likes, thumbnailImage } = post;
    const [isPostDropdownOpen, setIsPostDropdownOpen] = useState(false);
    const { openModal } = useModal();
    const router = useRouter();

    const postDropdownMenus: PrimaryDropdownProps['dropdownMenus'] = [
        {
            icon: '/icon/icon-scissors.svg',
            text: '게시글 수정',
            onClick: () => router.push(DYNAMIC_PATH.EDITPOST(id)),
        },
        {
            icon: '/icon/icon-trashcan.svg',
            text: '게시글 삭제',
            onClick: () => openModal(<DeletePostModalContent postId={id} stockSymbol={stock.symbol} />),
        },
    ];

    return (
        <div className='sm:w-[60%] sm:border sm:border-moneed-gray-4 rounded-[1.2rem] sm:p-8'>
            <div className='pb-[1.3rem] pt-[1.4rem]'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-[.6rem] sm:gap-[.8rem]'>
                        <Image
                            src={author.profileImage}
                            alt='profile'
                            className='rounded-full size-[2.4rem] sm:size-[3.2rem]'
                            width={32}
                            height={32}
                        />
                        <div className='flex items-center gap-[.4rem]'>
                            <span className='text-[1.4rem] font-normal leading-[140%] text-moneed-black'>
                                {author.nickname}
                            </span>
                            <i className='size-[.4rem] rounded-full bg-moneed-gray-5'></i>
                            <DateFormatter createdAt={new Date(createdAt)} />
                        </div>
                    </div>
                    <div className='relative ml-auto shrink-0 z-2'>
                        <button
                            className='cursor-pointer rounded-full overflow-hidden aspect-square w-[2.4rem]'
                            onClick={() => setIsPostDropdownOpen(true)}
                        >
                            <Image
                                src='/icon/icon-more.svg'
                                alt='메뉴 버튼'
                                className='w-full h-full object-cover'
                                width={24}
                                height={24}
                            />
                        </button>
                        {isPostDropdownOpen && (
                            <PrimaryDropdown
                                dropdownMenus={postDropdownMenus}
                                closeDropdown={() => setIsPostDropdownOpen(false)}
                            />
                        )}
                    </div>
                </div>
                <p className='mt-[2.4rem] text-[1.6rem] font-semibold leading-[140%] text-moneed-black'>{title}</p>
                <div className='w-full'>
                    {thumbnailImage && (
                        <div className='w-full flex justify-center items-center relative'>
                            <Image
                                src={thumbnailImage}
                                alt='thumbnail'
                                className='rounded-[.8rem] max-w-full object-cover'
                                width={100}
                                height={100}
                            />
                        </div>
                    )}
                    <p className='mt-[2.4rem] mb-[.8rem] text-[1.6rem] font-normal leading-[145%] text-moneed-gray-9'>
                        {content}
                    </p>
                </div>
            </div>
            <div className='flex pb-[1.6rem] pt-[.4rem]'>
                <PostLikeButton postId={id} isLiked={isLiked} likeCount={likes} />
                <CommentIcon commentCount={commentsCount} />
                <ClipBoardButton />
            </div>
        </div>
    );
}
