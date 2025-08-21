'use client';

import { EmblaOptionsType } from 'embla-carousel';
import { useRouter } from 'next/navigation';
import { PostThumbnail as TPostThumbnail } from '@/types/post';
import PostThumbnailCard from '@/components/PostThumbnailCard';
import { useEffect, useState } from 'react';
import { getCookie } from '@/utils/cookie';
import { TokenPayload } from '@/types/auth';
import { TOKEN_KEY } from '@/constants/token';
import { decodeJwt } from 'jose';

const PostThumbnail = ({ post }: { post: TPostThumbnail }) => {
    const { user, content, isLiked, id, thumbnailImage, likeCount, createdAt, title, commentCount, stock } = post;
    const { symbol } = stock;
    const postImages = thumbnailImage ? [thumbnailImage] : [];
    const [decodedToken, setDecodedToken] = useState<TokenPayload | null>(null);
    const isMyPost = decodedToken?.userId === user.id;

    const OPTIONS: EmblaOptionsType = {
        slidesToScroll: 1,
        loop: true,
        align: 'center',
        // draggable: true,
        containScroll: 'trimSnaps',
    };

    const router = useRouter();
    const movetoDetail = () => {
        router.push(`/community/${symbol}/posts/${id}`);
    };

    useEffect(() => {
        const accessToken = getCookie(TOKEN_KEY.ACCESS_TOKEN);
        if (accessToken) {
            setDecodedToken(decodeJwt<TokenPayload>(accessToken));
        }
    }, []);

    return (
        <>
            <PostThumbnailCard onClick={movetoDetail}>
                <PostThumbnailCard.Header>
                    <PostThumbnailCard.AuthorWithDate user={user} createdAt={new Date(createdAt)} />
                    {isMyPost && <PostThumbnailCard.Dropdown post={post} />}
                </PostThumbnailCard.Header>
                <PostThumbnailCard.Body>
                    <PostThumbnailCard.Title title={title} />
                    <PostThumbnailCard.Content content={content} />
                    <PostThumbnailCard.Images postImages={postImages} options={OPTIONS} />
                </PostThumbnailCard.Body>
                <PostThumbnailCard.Footer>
                    <PostThumbnailCard.Actions
                        postId={Number(id)}
                        isLiked={isLiked}
                        likeCount={likeCount}
                        commentCount={commentCount}
                    />
                </PostThumbnailCard.Footer>
            </PostThumbnailCard>
        </>
    );
};

export default PostThumbnail;
