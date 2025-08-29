import { NextRequest, NextResponse } from 'next/server';
import { REASON_CODES } from './constants/snackbar';
import { verifyToken } from '@moneed/auth';
import { getServerSideCookie } from './utils/cookie.server';

const protectedRoutes = [
    '/mypage',
    '/editpost',
    '/mycomment',
    '/mypost',
    '/myprofile',
    '/searchstocktype',
    '/selectstocktype',
    '/writepost',
];

const guestOnlyRoutes = ['/onboarding', '/auth/kakao/callback'];

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isGuestOnlyRoute = guestOnlyRoutes.includes(path);
    const accessToken = await getServerSideCookie(process.env.JWT_ACCESS_NAME || 'access_token');

    const session = await verifyToken({ jwt: accessToken, key: process.env.SESSION_SECRET });

    if (isGuestOnlyRoute && session.payload) {
        return NextResponse.redirect(new URL(`/?reason=${REASON_CODES.LOGGED_IN}`, req.nextUrl));
    }

    if (isProtectedRoute && (session.isExpired || session.isInvalid || !accessToken)) {
        return NextResponse.redirect(new URL(`/onboarding?reason=${REASON_CODES.NO_SESSION}`, req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
