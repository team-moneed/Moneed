import { ShortService } from '@/4_features/shorts/server/short.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const cursor = searchParams.get('cursor') === '' ? null : searchParams.get('cursor');
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10;

    const shortService = new ShortService();

    const shorts = await shortService.getInfiniteShorts({ cursor, limit });
    return NextResponse.json(shorts);
}
