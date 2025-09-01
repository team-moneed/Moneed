'use client';

import dynamic from 'next/dynamic';
const Comments = dynamic(() => import('./Comments'), { ssr: false });

// TODO: 삭제된 댓글 -> "삭제된 댓글입니다" 표시
const MyComment = () => {
    return (
        <div className='px-8 max-w-512 mx-auto'>
            <Comments />
        </div>
    );
};

export default MyComment;
