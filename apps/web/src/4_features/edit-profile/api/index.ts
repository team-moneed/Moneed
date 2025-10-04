import { API_PATH } from '@/6_shared/config';
import { http } from '@/6_shared/api/client';
import { toUser } from './mapper';
import { UserDTO } from './type';

export async function fetchUserInfo() {
    const res = await http.get<UserDTO>(API_PATH.USER_ME);
    return toUser(res.data);
}
