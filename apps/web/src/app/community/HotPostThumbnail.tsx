import PostThumbnailCard from '@/components/PostThumbnailCard';
import { HotPostThumbnail as THotPostThumbnail } from '@/types/post';
import { getCookie } from '@/utils/cookie';
import { TOKEN_KEY } from '@/constants/token';
import { EmblaOptionsType } from 'embla-carousel';
import { useRouter } from 'next/navigation';
import { decodeJwt } from 'jose';
import { TokenPayload } from '@/types/auth';
import { useEffect, useState } from 'react';

export default function HotPostThumbnail({ post }: { post: THotPostThumbnail }) {
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
    const movetoDetail = ({ postId }: { postId: number }) => {
        router.push(`/community/${symbol}/posts/${postId}`);
    };

    useEffect(() => {
        const accessToken = getCookie(TOKEN_KEY.ACCESS_TOKEN);
        if (accessToken) {
            setDecodedToken(decodeJwt<TokenPayload>(accessToken));
        }
    }, []);

    return (
        <>
            <PostThumbnailCard onClick={() => movetoDetail({ postId: id })}>
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
}
