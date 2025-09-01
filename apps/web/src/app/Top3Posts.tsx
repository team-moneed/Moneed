'use client';

import PostThumbnailCard from '@/components/PostThumbnailCard';
import { BoardRankResponse } from '@/types/board';
import { useRouter } from 'next/navigation';
import { useTop3Posts } from '@/queries/posts.query';

export default function Top3Posts({ selectedStock }: { selectedStock: BoardRankResponse }) {
    const router = useRouter();
    const anHour = 1000 * 60 * 60;
    const { data: postsWithUser } = useTop3Posts({ symbol: selectedStock.symbol, staleTime: anHour });

    const moveToDetail = (postId: number) => {
        router.push(`/community/${selectedStock.symbol}/posts/${postId}`);
    };

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[.6rem] gap-x-[1.6rem] mt-4 md:gap-y-[1.2rem]'>
            {postsWithUser.map(post => (
                <PostThumbnailCard key={post.id} onClick={() => moveToDetail(post.id)}>
                    <PostThumbnailCard.Body>
                        <PostThumbnailCard.Title title={post.title} />
                        <PostThumbnailCard.Content content={post.content} />
                    </PostThumbnailCard.Body>
                    <PostThumbnailCard.Footer>
                        <PostThumbnailCard.AuthorWithDate user={post.user} createdAt={new Date(post.createdAt)} />
                    </PostThumbnailCard.Footer>
                </PostThumbnailCard>
            ))}
        </div>
    );
}
