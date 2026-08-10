"use client";

import { useCurrentUser } from "./useAuth";

export type AppRole = "admin" | "student" | null;

/** Nguồn DUY NHẤT để biết role hiện tại — mọi UI gating (isAdmin...) đi qua đây. */
export function useUserRole(): AppRole {
  const { data: user } = useCurrentUser();
  if (!user) return null;
  if (user.isAdmin) return "admin";
  return "student";
}
