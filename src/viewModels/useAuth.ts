"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

// Chỉ phần hạ tầng (đọc phiên đăng nhập đã lưu) — CHƯA có useLogin/useRegister/...
// vì backend chưa có endpoint /Auth/* (đó là việc của Flow 1). Khi Flow 1 xong,
// thêm các mutation hook đó vào `features/auth/api/`, KHÔNG sửa file này thành nơi
// chứa toàn bộ logic Auth — file này chỉ nên biết "ai đang đăng nhập", không biết
// "đăng nhập bằng cách nào".

export interface StoredUser {
  userId: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
  isStudent: boolean;
}

const AUTH_KEYS = {
  currentUser: ["auth", "currentUser"] as const,
};

function readStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("currentUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_KEYS.currentUser,
    queryFn: () => readStoredUser(),
    staleTime: Infinity,
  });
}

export function useIsAuthenticated(): boolean {
  const { data } = useCurrentUser();
  return !!data;
}

/** Gọi sau khi 1 mutation login/register/logout ghi localStorage xong, để React Query đồng bộ lại. */
export function useInvalidateCurrentUser() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: AUTH_KEYS.currentUser });
}
