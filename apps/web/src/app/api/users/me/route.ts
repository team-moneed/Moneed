import { getSession } from '@/lib/session';
import { UpdateUserProfileRequest } from '@/types/user';
import UserService from '@/services/user.service';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ message: '유저 정보를 조회할 수 없습니다. 로그인을 해주세요.' }, { status: 401 });
    }

    const { userId } = session;
    const userService = new UserService();

    const user = await userService.getUserInfo({ userId });

    if (!user) {
        return NextResponse.json({ message: '유저가 존재하지 않습니다.' }, { status: 404 });
    }

    return NextResponse.json(user);
}

export async function PUT(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ message: '유저 정보를 조회할 수 없습니다. 로그인을 해주세요.' }, { status: 401 });
    }

    const { userId } = session;
    const formData = await request.formData();
    const nickname = formData.get('nickname') as UpdateUserProfileRequest['nickname'];
    const profileImage = formData.get('profileImage') as UpdateUserProfileRequest['profileImage'];
    const prevProfileImageUrl = formData.get('prevProfileImageUrl') as UpdateUserProfileRequest['prevProfileImageUrl'];
    const userService = new UserService();

    try {
        const user = await userService.updateUserProfile({ userId, nickname, profileImage, prevProfileImageUrl });
        return NextResponse.json(user);
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 409 });
        }
        return NextResponse.json({ message: '닉네임 변경에 실패했습니다.' }, { status: 500 });
    }
}
