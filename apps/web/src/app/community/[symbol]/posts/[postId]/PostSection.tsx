'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import DateFormatter from '@/components/Dateformatter';
import { PrimaryDropdown, PrimaryDropdownProps } from '@/components/Dropdown';
import { deletePost } from '@/apis/post.api';
import { REASON_CODES } from '@/constants/snackbar';
import Image from 'next/image';
import PostLikeButton from '@/components/Post/PostLikeButton';
import PostCommentButton from '@/components/Post/PostCommentButton';
import PostClipBoardButton from '@/components/Post/PostClipBoardButton';
import { PostDetail } from '@/types/post';

export default function PostSection(props: PostDetail) {
    const { id, user, stock, title, content, createdAt, isLiked, likeCount, thumbnailImage, comments } = props;
    const [isPostDropdownOpen, setIsPostDropdownOpen] = useState(false);
    const { confirm } = useModal();
    const router = useRouter();

    const openPostdropdown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsPostDropdownOpen(true);
    };

    const closePostDropdown = () => {
        setIsPostDropdownOpen(false);
    };

    //게시글 삭제할건지 묻는 모달
    const openPostDeletemodal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const result = confirm(
            <span>
                삭제된 내용은 복구되지 않아요.
                <br />
                정말 삭제하실건가요?
            </span>,
        );
        result.then(confirmed => {
            if (confirmed) {
                handleDeletePost(e);
            }
        });
    };

    //게시글 삭제 api 연동
    const handleDeletePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
        await deletePost({ postId: id });
        router.push(`/community/${stock.id}?reason=${REASON_CODES.POST_DELETED}`);
        e.stopPropagation();
    };

    const onEditPost = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        router.push(`/editpost/${id}`);
    };

    const postDropdownMenus: PrimaryDropdownProps['dropdownMenus'] = [
        {
            icon: '/icon/icon-scissors.svg',
            text: '게시글 수정',
            onClick: onEditPost,
        },
        {
            icon: '/icon/icon-trashcan.svg',
            text: '게시글 삭제',
            onClick: openPostDeletemodal,
        },
    ];

    return (
        <div className='lg:w-[60%] lg:border lg:border-moneed-gray-4 rounded-[1.2rem] lg:p-8'>
            <div className='pb-[1.3rem] pt-[1.4rem]'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-[.6rem] lg:gap-[.8rem]'>
                        <Image
                            src={user.profileImage}
                            alt='profile'
                            className='rounded-full size-[2.4rem] lg:size-[3.2rem]'
                            width={32}
                            height={32}
                        />
                        <div className='flex items-center gap-[.4rem]'>
                            <span className='text-[1.4rem] font-normal leading-[140%] text-moneed-black'>
                                {user.nickname}
                            </span>
                            <i className='size-[.4rem] rounded-full bg-moneed-gray-5'></i>
                            <DateFormatter createdAt={new Date(createdAt)} />
                        </div>
                    </div>
                    <div className='relative ml-auto shrink-0 z-2'>
                        <div
                            className='cursor-pointer rounded-full overflow-hidden aspect-square w-[2.4rem]'
                            onClick={openPostdropdown}
                        >
                            <Image
                                src='/icon/icon-more.svg'
                                alt=''
                                className='w-full h-full object-cover'
                                width={24}
                                height={24}
                            />
                        </div>
                        {isPostDropdownOpen && (
                            <PrimaryDropdown dropdownMenus={postDropdownMenus} closeDropdown={closePostDropdown} />
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
                <PostLikeButton postId={id} isLiked={isLiked} likeCount={likeCount} />
                <PostCommentButton commentCount={comments.length} />
                <PostClipBoardButton />
            </div>
        </div>
    );
}
