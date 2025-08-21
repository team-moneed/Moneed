'use client';

import CompanyInfoBox from '@/components/Community/CompanyInfoBox';
import Vote from './Vote';
import PostSection from './PostsSection';
import { SnackbarTrigger } from '@/components/Snackbar';
import dynamic from 'next/dynamic';
import { DesktopHeader, MobileHeader } from '@/components/Layout/Header';
import { useParams, useSearchParams } from 'next/navigation';
import { useStockBySymbol } from '@/queries/stock.query';
const StockTypeBar = dynamic(() => import('@/app/community/StockTypeBar'), { ssr: false });
const StockInfoBox = dynamic(() => import('@/components/Community/StockInfoBox'), { ssr: false });

export default function CommunityPage() {
    const { symbol } = useParams<{ symbol: string }>();
    const searchParams = useSearchParams();
    const reason = searchParams.get('reason') || '';
    const { data: stock } = useStockBySymbol({ symbol: symbol || '' });
    if (!stock) return null;

    return (
        <>
            <MobileHeader />
            <DesktopHeader />
            <div>
                <StockTypeBar />
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
