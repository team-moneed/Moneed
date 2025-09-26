import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from './user.type';
import { ProviderType } from '@moneed/auth';

interface UserStore {
    user: User | null;
    setUser: (user: User) => void;
    provider: ProviderType | null;
    setProvider: (provider: ProviderType | null) => void;
    clearUserInfo: () => void;
}

const useUserStore = create<UserStore>()(
    persist(
        set => ({
            user: null,
            setUser: user => set({ user }),
            provider: null,
            setProvider: provider => set({ provider }),
            clearUserInfo: () => set({ user: null, provider: null }),
        }),
        {
            name: 'user-storage',
        },
    ),
);

export default useUserStore;
