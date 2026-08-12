import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type { User } from "@/models/entities";

interface LoginRequest {
  email: string;
  password?: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiClient.post<LoginResponse>("/Auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      // Khi có API thực, lưu token vào localStorage
      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        queryClient.setQueryData(["currentUser"], data.user);
      }
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await apiClient.post("/Auth/register", data);
      return response.data;
    }
  });
}
