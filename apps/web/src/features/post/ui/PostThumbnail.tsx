'use client';

import { EmblaOptionsType } from 'embla-carousel';
import { useRouter } from 'next/navigation';
import { Post } from '@/entities/post';
import PostThumbnailCard from '@/entities/post/ui/PostThumbnailCard';
import { useEffect, useState } from 'react';
import { getToken } from '@/shared/utils/index.client';
import type { TokenPayload } from '@moneed/auth';
import { TOKEN_KEY, DYNAMIC_PATH } from '@/shared/config';
import { decodeJwt } from 'jose';
import { usePostComments } from '../query';

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
        const accessToken = getToken(TOKEN_KEY.ACCESS_TOKEN);
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
