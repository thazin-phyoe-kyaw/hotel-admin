import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
interface User {
  id: number;
  name: string;
  email: string;
  profile_image?: string;
}

interface AuthState {
  token: string | null;
  hotelId: string | null;
  role: string | null;
  user: User | null;
  selectedHotelName: string | null;
  setAuth: (data: { token: string; role: string; user: User | null }) => void;
  setHotel: (id: string, name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      hotelId: null,
      role: null,
      user: null,
      selectedHotelName: null,

      setAuth: (data) =>
        set({
          token: data.token,
          role: data.role,
          user: data.user || null,
        }),

      setHotel: (id, name) =>
        set({
          hotelId: id,
          selectedHotelName: name,
        }),

      logout: () =>
        set({
          token: null,
          hotelId: null,
          role: null,
          user: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
