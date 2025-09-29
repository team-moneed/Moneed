import { NextRequest, NextResponse } from 'next/server';
import UpdateShortsService from './service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await UpdateShortsService.updateShorts({
        query: '주식투자',
        pageToken: '',
    });
    return NextResponse.json({ message: 'Shorts updated' });
}
