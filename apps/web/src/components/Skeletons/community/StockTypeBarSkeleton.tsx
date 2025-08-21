import Icon from '@/components/Icon';
import Link from 'next/link';
import ChipSkeleton from '../ChipSkeleton';

export default function StockTypeBarSkeleton({ count }: { count: number }) {
    return (
        <div className='relative'>
            <div className='flex gap-4 mb-6 overflow-x-auto whitespace-nowrap items-center'>
                <Link href='/selectstocktype' className='shrink-0'>
                    <Icon iconUrl='/icon/icon-addcircle.svg' width={30} height={30} />
                </Link>
                {Array.from({ length: count }, (_, i) => (
                    <ChipSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
