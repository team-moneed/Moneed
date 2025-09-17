import Footer from '@/shared/ui/layout/Footer';
import RootNav from '@/shared/ui/layout/RootNav';

export default function LeaveLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <RootNav />
            <main className='flex-1'>
                <div className='max-w-[40rem] mx-auto px-[2rem] pt-[1.6rem] pb-[2.4rem] h-full'>{children}</div>
            </main>
            <Footer />
        </>
    );
}
