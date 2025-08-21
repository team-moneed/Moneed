import ShortService from '@/services/short.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const cursor = searchParams.get('cursor');
    const limit = Number(searchParams.get('limit')) || 10;

    const shortService = new ShortService();

    const shorts = await shortService.getShorts({ cursor, limit });
    return NextResponse.json(shorts);
}
