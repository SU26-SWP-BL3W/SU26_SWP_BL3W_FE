import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import type {
  User,
  LoginResponse,
  RegisterRequest,
  UpdateStudentProfileRequest,
  FptStudentResponse,
  BaseResponse,
} from "@/models/entities";

// ─── Login ───────────────────────────────────────────────────

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { email: string; password?: string }) => {
      const res = await apiClient.post<BaseResponse<LoginResponse>>("/Auth/login", data);
      return res.data.data;
    },
    onSuccess: (data) => {
      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        queryClient.setQueryData(["currentUser"], data.user);
      }
    },
  });
}

// ─── Register ────────────────────────────────────────────────

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const res = await apiClient.post<BaseResponse<User>>("/Auth/register", data);
      return res.data.data;
    },
  });
}

// ─── Google Login ────────────────────────────────────────────

export function useGoogleLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (idToken: string) => {
      const res = await apiClient.post<BaseResponse<LoginResponse>>("/Auth/google-login", { idToken });
      return res.data.data;
    },
    onSuccess: (data) => {
      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        queryClient.setQueryData(["currentUser"], data.user);
      }
    },
  });
}

// ─── Logout ──────────────────────────────────────────────────

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/Auth/logout");
    },
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      queryClient.clear();
    },
  });
}

// ─── Refresh Token ────────────────────────────────────────────

export function useRefreshToken() {
  return useMutation({
    mutationFn: async (refreshToken: string) => {
      const res = await apiClient.post<BaseResponse<{ accessToken: string; refreshToken: string }>>(
        "/Auth/refresh-token",
        { refreshToken }
      );
      return res.data.data;
    },
  });
}

// ─── Verify Email ─────────────────────────────────────────────

export function useVerifyEmail(token: string | null) {
  return useQuery({
    queryKey: ["verifyEmail", token],
    queryFn: async () => {
      const res = await apiClient.get<BaseResponse<boolean>>("/Auth/verify-email", {
        params: { token },
      });
      return res.data;
    },
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  });
}

// ─── Student Profile ─────────────────────────────────────────

/** POST /api/Auth/student-profiles — Nộp hồ sơ lần đầu */
export function useSubmitStudentProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateStudentProfileRequest) => {
      const res = await apiClient.post<BaseResponse<User>>("/Auth/student-profiles", data);
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
    },
  });
}

/** PUT /api/Auth/student-profiles — Cập nhật hồ sơ */
export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateStudentProfileRequest) => {
      const res = await apiClient.put<BaseResponse<User>>("/Auth/student-profiles", data);
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
    },
  });
}

// ─── FPT Mock Verification ────────────────────────────────────

export function useFptStudentVerification() {
  return useMutation({
    mutationFn: async (studentCode: string) => {
      const res = await apiClient.get<BaseResponse<FptStudentResponse>>(
        `/fpt-mock/students/${studentCode}`
      );
      return res.data.data;
    },
  });
}

// ─── Password Management ──────────────────────────────────────

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await apiClient.post("/Auth/forgot-password", { email });
      return res.data;
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: { token: string; newPassword: string }) => {
      const res = await apiClient.post("/Auth/reset-password", data);
      return res.data;
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const res = await apiClient.put("/Auth/change-password", data);
      return res.data;
    },
  });
}

// ─── Two-Strike Unblock Request ──────────────────────────────

export function useRequestUnblock() {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await apiClient.post("/Auth/request-unblock", { email });
      return res.data;
    },
  });
}
