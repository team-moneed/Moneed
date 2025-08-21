import ShortService from '@/services/short.service';
import { ERROR_MSG } from '@/constants/errorMsg';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(_: NextRequest, { params }: { params: Promise<{ videoId: string }> }) {
    try {
        const { videoId } = await params;

        if (!videoId) {
            return NextResponse.json({ error: ERROR_MSG.SHORT_VIDEO_ID_REQUIRED }, { status: 400 });
        }

        const shortService = new ShortService();
        const short = await shortService.getShortByVideoId({ videoId });

        if (!short) {
            return NextResponse.json({ error: ERROR_MSG.SHORT_NOT_FOUND }, { status: 404 });
        }

        return NextResponse.json(short);
    } catch (error) {
        console.error('Error fetching short by videoId:', error);
        return NextResponse.json({ error: ERROR_MSG.SHORT_FETCH_ERROR }, { status: 500 });
    }
}
