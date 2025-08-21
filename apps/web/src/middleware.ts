import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { REASON_CODES } from './constants/snackbar';

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
    const session = await getSession();

    if (isGuestOnlyRoute && session?.userId) {
        return NextResponse.redirect(new URL(`/?reason=${REASON_CODES.LOGGED_IN}`, req.nextUrl));
    }

    if (isProtectedRoute && (!session?.userId || (session.exp && session.exp < Date.now() / 1000))) {
        return NextResponse.redirect(new URL(`/onboarding?reason=${REASON_CODES.NO_SESSION}`, req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
