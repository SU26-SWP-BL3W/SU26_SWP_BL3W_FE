import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { User } from "@/models/entities";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<User>("/Users/me");
      return response.data;
    },
    // Không retry nếu lỗi 401 (chưa đăng nhập)
    retry: false,
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await apiClient.put("/Auth/student-profiles", data);
      return response.data;
    },
  });
}

export function useGetUserRejections(userId: string) {
  return useQuery({
    queryKey: ["userRejections", userId],
    queryFn: async () => {
      const response = await apiClient.get(`/UserRejections/user/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
}
