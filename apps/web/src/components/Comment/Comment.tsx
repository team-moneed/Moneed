'use client';

import { useEffect, useState } from 'react';
import { PrimaryDropdown, PrimaryDropdownProps } from '@/components/Dropdown';
import Image from 'next/image';
import { Comment as TComment } from '@/types/post';
import DateFormatter from '../Dateformatter';
import { getCookie } from '@/utils/cookie';
import { TOKEN_KEY } from '@/constants/token';
import { decodeJwt } from 'jose';
import { TokenPayload } from '@/types/auth';

type CommentType = {
    comment: TComment;
    actions: PrimaryDropdownProps['dropdownMenus'];
};

const Comment = ({ comment, actions }: CommentType) => {
    const { content, createdAt, user, updatedAt } = comment;
    const [decodedToken, setDecodedToken] = useState<TokenPayload | null>(null);
    const isMyComment = decodedToken?.userId === user.id;

    const [isDropdownOpen, setIsdropdownOpen] = useState(false);
    const isEdited = updatedAt !== createdAt;

    //댓글 수정/삭제 드롭다운
    const openDropdown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsdropdownOpen(prev => !prev);
    };

    const closeDropdown = () => {
        setIsdropdownOpen(false);
    };

    useEffect(() => {
        const accessToken = getCookie(TOKEN_KEY.ACCESS_TOKEN);
        if (accessToken) {
            setDecodedToken(decodeJwt<TokenPayload>(accessToken));
        }
    }, []);

    return (
        <>
            <div className='relative flex items-start gap-[.6rem] w-full'>
                <i className='absolute block w-[.1rem] top-0 bottom-0 left-[1.2rem] lg:left-[1.6rem] bg-moneed-gray-5'></i>
                <Image
                    src={user.profileImage}
                    alt='profile'
                    className='relative rounded-full size-[2.4rem] lg:size-[3.2rem] shrink-0'
                    width={32}
                    height={32}
                />
                <div className='flex-1'>
                    <span className='text-[1.4rem] font-bold leading-[140%] text-moneed-black'>{user.nickname}</span>
                    <i className='w-[.2rem] h-[.2rem] mx-[.8rem] mb-[.2rem] rounded-full bg-moneed-gray-5 inline-block '></i>
                    <span className='text-[1.4rem] font-normal leading-[142%] text-moneed-gray-7'>
                        <DateFormatter createdAt={new Date(isEdited ? updatedAt : createdAt)} />
                        {isEdited && <span className='text-moneed-gray-7'> (수정됨)</span>}
                    </span>
                    <div className='text-[1.4rem] font-normal leading-[140%]'>{content}</div>
                </div>
                {isMyComment && (
                    <div className='relative'>
                        <div
                            className='relative cursor-pointer rounded-full overflow-hidden aspect-square w-[2.4rem] shrink-0 ml-auto'
                            onClick={openDropdown}
                        >
                            <img src='/icon/icon-more.svg' alt='more' className='w-full h-full object-cover' />
                        </div>
                        {isDropdownOpen && <PrimaryDropdown dropdownMenus={actions} closeDropdown={closeDropdown} />}
                    </div>
                )}
            </div>
        </>
    );
};

export default Comment;
