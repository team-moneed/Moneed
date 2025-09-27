'use client';

import { EmblaOptionsType } from 'embla-carousel';
import { useRouter } from 'next/navigation';
import { Post } from '@/entities/post';
import PostThumbnailCard from '@/entities/post/ui/PostThumbnailCard';
import { useEffect, useState } from 'react';
import type { TokenPayload } from '@moneed/auth';
import { DYNAMIC_PATH } from '@/shared/config';
import { decodeJwt } from 'jose';
import { usePostComments } from '../query';
import TokenLocalStorage from '@/shared/utils/token.localstorage';

const PostThumbnail = ({ post }: { post: Post }) => {
    const [decodedToken, setDecodedToken] = useState<TokenPayload | null>(null);
    const { data: comments } = usePostComments({ postId: post.id });
    const isMyPost = decodedToken?.userId === post.author.id;

    const OPTIONS: EmblaOptionsType = {
        slidesToScroll: 1,
        loop: true,
        align: 'center',
        // draggable: true,
        containScroll: 'trimSnaps',
    };

    const router = useRouter();
    const movetoDetail = () => {
        router.push(DYNAMIC_PATH.POST_DETAIL(post.id));
    };

    useEffect(() => {
        const accessToken = TokenLocalStorage.getToken(process.env.NEXT_PUBLIC_JWT_ACCESS_NAME || 'access_token');
        if (accessToken) {
            setDecodedToken(decodeJwt<TokenPayload>(accessToken));
        }
    }, []);

    return (
        <>
            <PostThumbnailCard onClick={movetoDetail}>
                <PostThumbnailCard.Header>
                    <PostThumbnailCard.AuthorWithDate author={post.author} createdAt={new Date(post.createdAt)} />
                    {isMyPost && <PostThumbnailCard.Dropdown post={post} />}
                </PostThumbnailCard.Header>
                <PostThumbnailCard.Body>
                    <PostThumbnailCard.Title title={post.title} />
                    <PostThumbnailCard.Content content={post.content} />
                    <PostThumbnailCard.Images
                        postImages={post.thumbnailImage ? [post.thumbnailImage] : []}
                        options={OPTIONS}
                    />
                </PostThumbnailCard.Body>
                <PostThumbnailCard.Footer>
                    <PostThumbnailCard.Actions
                        postId={post.id}
                        isLiked={post.isLiked}
                        likeCount={post.likes}
                        commentCount={comments?.length ?? 0}
                    />
                </PostThumbnailCard.Footer>
            </PostThumbnailCard>
        </>
    );
};

export default PostThumbnail;
