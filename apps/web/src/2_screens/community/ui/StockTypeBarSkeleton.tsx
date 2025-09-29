import Icon from '@/6_shared/ui/Icon';
import Link from 'next/link';
import ChipSkeleton from '../../../6_shared/ui/Skeletons/ChipSkeleton';
import { PATH } from '@/6_shared/config';

export default function StockTypeBarSkeleton({ count }: { count: number }) {
    return (
        <div className='relative'>
            <div className='flex gap-4 mb-6 overflow-x-auto whitespace-nowrap items-center'>
                <Link href={PATH.SELECTSTOCKTYPE} className='shrink-0'>
                    <Icon iconUrl='/icon/icon-addcircle.svg' width={30} height={30} />
                </Link>
                {Array.from({ length: count }, (_, i) => (
                    <ChipSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
