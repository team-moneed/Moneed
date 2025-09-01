import { cn } from '@/utils/style';
import { useState } from 'react';
import { PrimaryDropdown, PrimaryDropdownProps } from './Dropdown';
import DateFormatter from '@/components/Dateformatter';
import ImageCarousel from './Carousel/ImageCarousel';
import { EmblaOptionsType } from 'embla-carousel';
import { useModal } from '@/context/ModalContext';
import { useRouter } from 'next/navigation';
import { PostThumbnail } from '@/types/post';
import { deletePost } from '@/apis/post.api';
import { REASON_CODES } from '@/constants/snackbar';
import { queryClient } from './QueryClientProvider';
import PostLikeButton from './Post/PostLikeButton';
import PostCommentButton from './Post/PostCommentButton';
import PostClipBoardButton from './Post/PostClipBoardButton';

export const PostTitle = ({ title }: { title: string }) => {
    return <h3 className='text-[2rem] font-bold leading-[140%] text-moneed-black line-clamp-1 mb-[.6rem]'>{title}</h3>;
};

export const PostContent = ({ content }: { content: string }) => {
    return (
        <p className='font-normal text-lg leading-[140%] text-moneed-gray-9 line-clamp-3 min-h-[7.6rem]'>{content}</p>
    );
};

export const PostImages = ({ postImages, options }: { postImages: string[]; options: EmblaOptionsType }) => {
    if (postImages.length === 0) return null;

    return (
        <div>
            <ImageCarousel slides={postImages} options={options} />
        </div>
    );
};

export const PostActions = ({
    isLiked,
    likeCount,
    commentCount,
    postId,
}: {
    postId: number;
    isLiked: boolean;
    likeCount: number;
    commentCount: number;
}) => {
    return (
        <div className='flex'>
            <div className='relative z-2'>
                <PostLikeButton postId={postId} isLiked={isLiked} likeCount={likeCount} />
            </div>
            <div className='relative z-2'>
                <PostCommentButton commentCount={commentCount} />
            </div>
            <div className='relative z-2'>
                <PostClipBoardButton />
            </div>
        </div>
    );
};

export const PostAuthorWithDate = ({
    user,
    createdAt,
}: {
    user: { profileImage: string; nickname: string };
    createdAt: Date;
}) => {
    return (
        <div className='flex items-center gap-[.6rem] flex-1'>
            <div className='rounded-full overflow-hidden aspect-square sm:w-[2.8rem] w-[2.4rem]'>
                <img src={user.profileImage} alt={user.nickname} className='w-full h-full object-cover' />
            </div>
            <span className='text-[1.4rem] font-normal leading-[140%] text-moneed-black'>{user.nickname}</span>
            <i className='w-[.2rem] h-[.2rem] rounded-full bg-moneed-gray-5'></i>
            <DateFormatter createdAt={new Date(createdAt)} />
        </div>
    );
};

export const PostDropdown = ({ post }: { post: PostThumbnail }) => {
    const { confirm } = useModal();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const onEditPost = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        router.push(`/editpost/${post.id}`);
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
                handleDeletePost();
            }
        });
        setIsDropdownOpen(false);
    };

    //게시글 삭제 api 연동
    const handleDeletePost = async () => {
        const res = await deletePost({ postId: post.id });
        if (res.status === 200) {
            // TODO: 연속 두 개의 게시글 삭제 시 쿼리 파라미터(?reason)이 변경되지 않아 스낵바가 표시되지 않음
            router.push(`/community/${post.stock.id}?reason=${REASON_CODES.POST_DELETED}`);
            queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
    };

    // TODO: 자기 게시글인 경우에만 표시하도록 수정
    const dropdownMenus: PrimaryDropdownProps['dropdownMenus'] = [
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

    const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsDropdownOpen(prev => !prev);
        console.log('isDropdownOpen', isDropdownOpen);
    };

    const closeDropdown = (e?: Event) => {
        if (e) {
            e.stopPropagation();
        }
        setIsDropdownOpen(false);
    };

    return (
        <div className='relative ml-auto shrink-0 z-2'>
            <button
                className='cursor-pointer rounded-full overflow-hidden aspect-square w-[2.4rem]'
                onClick={toggleDropdown}
            >
                <img src='/icon/icon-more.svg' alt='' className='w-full h-full object-cover' />
            </button>
            {isDropdownOpen && <PrimaryDropdown dropdownMenus={dropdownMenus} closeDropdown={closeDropdown} />}
        </div>
    );
};

export const PostHeader = ({ children }: { children: React.ReactNode }) => {
    return <div className='flex items-center justify-between mb-[1.6rem]'>{children}</div>;
};

export const PostBody = ({ children }: { children: React.ReactNode }) => {
    return <div className='mb-[1.2rem] sm:mb-[1.6rem]'>{children}</div>;
};

export const PostFooter = ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>;
};

export const PostThumbnailCard = ({
    children,
    onClick,
    isDropdownOpen = false,
}: {
    children: React.ReactNode;
    onClick: () => void;
    isDropdownOpen?: boolean;
}) => {
    return (
        <div
            className={cn(
                'flex flex-col justify-between relative border border-solid border-moneed-gray-5 rounded-[1.8rem] mb-[1.6rem] cursor-pointer py-[2.4rem] px-[3.2rem]',
                isDropdownOpen && 'pointer-events-none',
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

const Post = Object.assign(PostThumbnailCard, {
    Title: PostTitle,
    Content: PostContent,
    Images: PostImages,
    Actions: PostActions,
    AuthorWithDate: PostAuthorWithDate,
    Dropdown: PostDropdown,
    Header: PostHeader,
    Body: PostBody,
    Footer: PostFooter,
});

export default Post;
