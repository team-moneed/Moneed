'use client';

import PostThumbnailCard from '@/components/PostThumbnailCard';
import { TopPostThumbnail } from '@/types/post';
import { useRouter } from 'next/navigation';

const Top5Thumbnail = ({ posts }: { posts: TopPostThumbnail }) => {
    const { user, content, title, createdAt, id, stock } = posts;
    const { symbol } = stock;
    const router = useRouter();
    const movetoDetail = () => {
        router.push(`/community/${symbol}/posts/${id}`);
    };
    return (
        <PostThumbnailCard onClick={movetoDetail}>
            <PostThumbnailCard.Body>
                <PostThumbnailCard.Title title={title} />
                <PostThumbnailCard.Content content={content} />
            </PostThumbnailCard.Body>
            <PostThumbnailCard.Footer>
                <PostThumbnailCard.AuthorWithDate user={user} createdAt={new Date(createdAt)} />
            </PostThumbnailCard.Footer>
        </PostThumbnailCard>
    );
};

export default Top5Thumbnail;
