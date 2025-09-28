import { NextRequest, NextResponse } from 'next/server';
import { REASON_CODES } from './src/6_shared/config/snackbar';
import { verifyToken } from '@moneed/auth';
import { PATH, TOKEN_KEY } from './src/6_shared/config';
import { REGEXP_PATH } from './src/6_shared/config/path';

const protectedRoutes = [
    REGEXP_PATH.MYPAGE,
    REGEXP_PATH.MYCOMMENT,
    REGEXP_PATH.MYPOST,
    REGEXP_PATH.MYPROFILE,
    REGEXP_PATH.EDITPOST,
    REGEXP_PATH.SEARCHSTOCKTYPE,
    REGEXP_PATH.SELECTSTOCKTYPE,
    REGEXP_PATH.WRITEPOST,
];

const guestOnlyRoutes = [REGEXP_PATH.ONBOARDING];

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => route.test(path));
    const isGuestOnlyRoute = guestOnlyRoutes.some(route => route.test(path));
    const accessToken = req.cookies.get(TOKEN_KEY.ACCESS_TOKEN)?.value || '';

    const session = await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET || '' });

    if (isGuestOnlyRoute && session.data) {
        return NextResponse.redirect(new URL(`${PATH.HOME}?reason=${REASON_CODES.LOGGED_IN}`, req.nextUrl));
    }

    if (isProtectedRoute && (session.error || !accessToken)) {
        return NextResponse.redirect(new URL(`${PATH.ONBOARDING}?reason=${REASON_CODES.NO_SESSION}`, req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
