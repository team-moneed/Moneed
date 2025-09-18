import RootNav from '@/shared/ui/layout/RootNav';

export default function OnBoardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <RootNav />
            <main className='flex-1'>{children}</main>
        </>
    );
}
