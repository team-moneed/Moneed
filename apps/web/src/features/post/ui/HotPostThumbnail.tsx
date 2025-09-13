import PostThumbnailCard from '@/entities/post/ui/PostThumbnailCard';
import { getAccessToken } from '@/shared/utils/token';
import { EmblaOptionsType } from 'embla-carousel';
import { useRouter } from 'next/navigation';
import { decodeJwt } from 'jose';
import type { TokenPayload } from '@moneed/auth';
import { useEffect, useState } from 'react';
import { DYNAMIC_PATH } from '@/shared/config';
import { Post } from '@/entities/post';
import { usePostComments } from '../query';

export default function HotPostThumbnail({ post }: { post: Post }) {
    const [decodedToken, setDecodedToken] = useState<TokenPayload | null>(null);
    const isMyPost = decodedToken?.userId === post.author.id;
    const { data: comments } = usePostComments({ postId: post.id });

    const OPTIONS: EmblaOptionsType = {
        slidesToScroll: 1,
        loop: true,
        align: 'center',
        // draggable: true,
        containScroll: 'trimSnaps',
    };

    const router = useRouter();
    const movetoDetail = ({ postId }: { postId: number }) => {
        router.push(DYNAMIC_PATH.POST_DETAIL(postId));
    };

    useEffect(() => {
        const accessToken = getAccessToken();
        if (accessToken) {
            setDecodedToken(decodeJwt<TokenPayload>(accessToken));
        }
    }, []);

    return (
        <>
            <PostThumbnailCard onClick={() => movetoDetail({ postId: post.id })}>
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
}
