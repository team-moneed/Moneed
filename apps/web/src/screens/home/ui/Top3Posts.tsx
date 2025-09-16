'use client';

import PostThumbnailCard from '@/entities/post/ui/PostThumbnailCard';
import { CommunityDTO } from '@/features/community/model';
import { useRouter } from 'next/navigation';
import { useTop3Posts } from '@/features/post/query';
import { DYNAMIC_PATH } from '@/shared/config';

export default function Top3Posts({ selectedStock }: { selectedStock: CommunityDTO }) {
    const router = useRouter();
    const anHour = 1000 * 60 * 60;
    const { data: postsWithUser } = useTop3Posts({ symbol: selectedStock.symbol, staleTime: anHour });

    const moveToDetail = (postId: number) => {
        router.push(DYNAMIC_PATH.POST_DETAIL(postId));
    };

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[1.6rem]'>
            {postsWithUser.map(post => (
                <PostThumbnailCard key={post.id} onClick={() => moveToDetail(post.id)}>
                    <PostThumbnailCard.Body>
                        <PostThumbnailCard.Title title={post.title} />
                        <PostThumbnailCard.Content content={post.content} />
                    </PostThumbnailCard.Body>
                    <PostThumbnailCard.Footer>
                        <PostThumbnailCard.AuthorWithDate author={post.author} createdAt={new Date(post.createdAt)} />
                    </PostThumbnailCard.Footer>
                </PostThumbnailCard>
            ))}
        </div>
    );
}
