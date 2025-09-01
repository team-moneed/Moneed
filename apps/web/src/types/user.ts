export interface UpdateUserProfileRequest {
    nickname: string;
    profileImage: File | string;
    prevProfileImageUrl: string;
}
