import { NextResponse } from 'next/server';
import UserService from '@/services/user.service';
import { getSession } from '@/lib/session';

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ message: '유저 정보를 조회할 수 없습니다. 로그인을 해주세요.' }, { status: 401 });
    }

    const { userId } = session;
    const { nickname } = await request.json();
    const userService = new UserService();

    const isDuplicate = await userService.isDuplicateNickname({ userId, nickname });
    if (isDuplicate) {
        return NextResponse.json({ message: '이미 존재하는 닉네임입니다.', nickname }, { status: 409 });
    } else {
        return NextResponse.json({ message: '사용 가능한 닉네임입니다.', nickname }, { status: 200 });
    }
}
