import { BackNotificationHeader } from '@/components/Layout/Header';

export default function SmartTalkLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <BackNotificationHeader title='스맛톡 둘러보기' />
            <div className='px-[2rem] py-[6rem]'>{children}</div>
        </>
    );
}
