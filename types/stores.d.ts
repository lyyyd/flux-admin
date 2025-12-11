type AuthUser = {
  accountNo: string;
  email: string;
  role: string[];
  exp: number;
};

declare module "@/stores/auth-store" {
  export function useAuthStore(): {
    auth: {
      setUser: (user: AuthUser | null) => void;
      setAccessToken: (token: string) => void;
    };
  };
}
