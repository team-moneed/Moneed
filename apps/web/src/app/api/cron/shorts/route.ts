import ShortService from '@/services/short.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const shortService = new ShortService();
    await shortService.updateShorts({ query: '주식투자', count: 10, pageToken: '', totalQuota: 10000, cost: 100 });
    return NextResponse.json({ message: 'Shorts updated' });
}
