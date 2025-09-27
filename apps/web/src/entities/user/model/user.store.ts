import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProviderType } from '@moneed/auth';

export type User = {
    id: string;
    nickname: string;
    profileImage: string;
    provider: ProviderType;
};

interface UserStore {
    user: User | null;
    setUser: (user: User) => void;
    clearUserInfo: () => void;
}

const useUserStore = create<UserStore>()(
    persist(
        set => ({
            user: null,
            setUser: user => set({ user }),
            clearUserInfo: () => set({ user: null }),
        }),
        {
            name: 'user-storage',
        },
    ),
);

export default useUserStore;
