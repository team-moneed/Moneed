'use client';

import CompanyInfoBox from '@/2_screens/community-stock/ui/CompanyInfoBox';
import Vote from '@/2_screens/community/ui/Vote';
import PostSection from '@/2_screens/community-stock/ui/PostsSection';
import { SnackbarTrigger } from '@/6_shared/ui/Snackbar';
import dynamic from 'next/dynamic';
import { useParams, useSearchParams } from 'next/navigation';
import { useStockBySymbol } from '@/4_features/stock';
const StockInfoBox = dynamic(() => import('@/2_screens/community-stock/ui/StockInfoBox'), { ssr: false });

export default function CommunityStockPage() {
    const { symbol } = useParams<{ symbol: string }>();
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason') || '';
    const { data: stock } = useStockBySymbol({ symbol: symbol || '' });
    if (!stock) return null;

    return (
        <>
            <div>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-y-[.6rem] gap-x-[1.6rem] mt-4 md:gap-y-[1.2rem] mb-[.6rem]'>
                    <StockInfoBox stock={stock} />
                    <CompanyInfoBox stock={stock} />
                </div>
                <Vote />
                <PostSection symbol={symbol || ''} />
                <SnackbarTrigger reason={reason} />
            </div>
        </>
    );
}
