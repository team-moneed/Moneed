import SubNav from '@/shared/ui/layout/SubNav';

export default function MyCommentLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SubNav title='내가 작성한 댓글' />
            <main className='flex-1'>{children}</main>
        </>
    );
}
