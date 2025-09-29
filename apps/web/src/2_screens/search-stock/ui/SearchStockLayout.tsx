import SubNav from '@/6_shared/ui/layout/SubNav';

export default function SearchStockLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SubNav title='게시판 선택' />
            <main className='flex-1'>{children}</main>
        </>
    );
}
