import { create } from 'zustand';

import { createJSONStorage, persist, zustandStorage } from '@/lib/storage';

// TODO: Move this to types/user.ts folder
interface User {
  id: number | null;
  username: string;
}

interface AuthStore {
  user: User;
  isLoggedIn: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

const defaultUser = {
  id: null,
  username: '',
  email: '',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      user: defaultUser,
      isLoggedIn: true,
      onLoginSuccess: () => {
        set({ isLoggedIn: true });
      },
      onLogout: () => {
        set({ isLoggedIn: false });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default useAuthStore;
