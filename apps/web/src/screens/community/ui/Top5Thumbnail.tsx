'use client';

import PostThumbnailCard from '@/entities/post/ui/PostThumbnailCard';
import { Post } from '@/entities/post';
import { useRouter } from 'next/navigation';
import { DYNAMIC_PATH } from '@/shared/config';

const Top5Thumbnail = ({ post }: { post: Post }) => {
    const { author, content, title, createdAt, id } = post;
    const router = useRouter();
    const movetoDetail = () => {
        router.push(DYNAMIC_PATH.POST_DETAIL(id));
    };
    return (
        <PostThumbnailCard onClick={movetoDetail}>
            <PostThumbnailCard.Body>
                <PostThumbnailCard.Title title={title} />
                <PostThumbnailCard.Content content={content} />
            </PostThumbnailCard.Body>
            <PostThumbnailCard.Footer>
                <PostThumbnailCard.AuthorWithDate author={author} createdAt={new Date(createdAt)} />
            </PostThumbnailCard.Footer>
        </PostThumbnailCard>
    );
};

export default Top5Thumbnail;
