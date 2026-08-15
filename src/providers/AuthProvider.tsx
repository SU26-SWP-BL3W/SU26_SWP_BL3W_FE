"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { User, EventRole } from "@/models/entities";
import apiClient from "@/models/apiClient";

export interface PresetAccount {
  email: string;
  roleName: "Admin" | "Coordinator" | "Judge" | "TeamLeader" | "Mentor" | "TeamMember";
  fullName: string;
  defaultRedirect: string;
}

export const PRESET_ACCOUNTS: PresetAccount[] = [
  {
    email: "admin.system@seal.edu.vn",
    roleName: "Admin",
    fullName: "Quản Trị Viên Hệ Thống (System Admin)",
    defaultRedirect: "/admin/dashboard",
  },
  {
    email: "ec.coordinator@seal.edu.vn",
    roleName: "Coordinator",
    fullName: "Điều Phối Viên Sự Kiện (Event Coordinator)",
    defaultRedirect: "/coordinator/dashboard",
  },
  {
    email: "mentor.ai@seal.edu.vn",
    roleName: "Mentor",
    fullName: "Cố Vấn Chuyên Môn AI (Mentor)",
    defaultRedirect: "/mentor/tracks",
  },
  {
    email: "judge.ai@seal.edu.vn",
    roleName: "Judge",
    fullName: "Giám Khảo Trí Tuệ Nhân Tạo (Judge)",
    defaultRedirect: "/judge/tracks",
  },
  {
    email: "leader.cybershield@fpt.edu.vn",
    roleName: "TeamLeader",
    fullName: "Trưởng Nhóm CyberShield (Team Leader)",
    defaultRedirect: "/my-team",
  },
];

// Trang đích sau khi đăng nhập thật, theo vai trò backend trả về.
const REDIRECT_BY_ROLE: Record<string, string> = {
  EventCoordinator: "/coordinator/dashboard",
  Judge: "/judge/tracks",
  Mentor: "/mentor/tracks",
  TeamLeader: "/my-team",
  TeamMember: "/my-team",
};

interface AuthContextType {
  user: User | null;
  activeRole: EventRole | null;
  isInitialized: boolean;
  login: (roleName?: string) => string;
  loginWithRole: (roleName: string) => string;
  loginWithEmail: (email: string) => string;
  loginWithCredentials: (email: string, password: string) => Promise<string>;
  loginWithGoogleCredential: (idToken: string) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<EventRole | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Khôi phục phiên từ localStorage (F5 safe)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      const storedRole = localStorage.getItem("activeRole");
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedRole) setActiveRole(JSON.parse(storedRole));
    } catch (e) {
      console.error("Lỗi khôi phục phiên từ localStorage:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const saveSession = (newUser: User, newRole: EventRole | null) => {
    setUser(newUser);
    setActiveRole(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      if (newRole) {
        localStorage.setItem("activeRole", JSON.stringify(newRole));
      } else {
        localStorage.removeItem("activeRole");
      }

      // Automatically fetch real JWT token from Backend DB
      const pass = newUser.isAdmin ? "AdminPassword123!" : "123456";
      apiClient
        .post<any>("/Auth/login", { email: newUser.email, password: pass })
        .then((res) => {
          const data = res.data?.data || res.data;
          const realToken = data?.token || data?.accessToken;
          if (realToken) {
            localStorage.setItem("accessToken", realToken);
          }
        })
        .catch((err) => {
          console.warn("[Auth] Failed to authenticate seeded user for JWT:", err?.message);
        });
    }
  };

  const loginWithRole = (roleName: string): string => {
    let newUser: User;
    let newRole: EventRole | null = null;
    let targetPath = "/";

    if (roleName === "Admin") {
      newUser = {
        id: "usr-admin-01",
        userId: "usr-admin-01",
        email: "admin@seal.com",
        fullName: "Quản Trị Viên Hệ Thống",
        isAdmin: true,
        isApproved: true,
        isFpt: true,
        isStudent: false,
        UserID: "usr-admin-01",
        FullName: "Quản Trị Viên Hệ Thống",
        IsAdmin: true,
      };
      newRole = null;
      targetPath = "/admin/dashboard";
    } else if (roleName === "Coordinator") {
      newUser = {
        id: "usr-ec-01",
        userId: "usr-ec-01",
        email: "ec1@example.com",
        fullName: "Điều Phối Viên Sự Kiện",
        isAdmin: false,
        isApproved: true,
        isFpt: true,
        isStudent: false,
        UserID: "usr-ec-01",
        FullName: "Điều Phối Viên Sự Kiện",
        IsAdmin: false,
      };
      newRole = {
        eventRoleId: "er-ec-100",
        userId: "usr-ec-01",
        roleName: "Coordinator",
        EventRoleId: "er-ec-100",
        UserId: "usr-ec-01",
        RoleName: "Coordinator",
        assignedEventIds: ["event-seal-2026"],
        AssignedEventIds: ["event-seal-2026"],
      };
      targetPath = "/coordinator/dashboard";
    } else if (roleName === "Mentor") {
      newUser = {
        id: "usr-mentor-01",
        userId: "usr-mentor-01",
        email: "mentor1@example.com",
        fullName: "Cố Vấn Chuyên Môn",
        isAdmin: false,
        isApproved: true,
        isFpt: true,
        isStudent: false,
        UserID: "usr-mentor-01",
        FullName: "Cố Vấn Chuyên Môn",
        IsAdmin: false,
      };
      newRole = {
        eventRoleId: "er-mentor-101",
        userId: "usr-mentor-01",
        roleName: "Mentor",
        EventRoleId: "er-mentor-101",
        UserId: "usr-mentor-01",
        RoleName: "Mentor",
        assignedEventIds: ["event-seal-2026"],
        AssignedEventIds: ["event-seal-2026"],
      };
      targetPath = "/mentor/tracks";
    } else if (roleName === "Judge") {
      newUser = {
        id: "usr-judge-01",
        userId: "usr-judge-01",
        email: "judge1@example.com",
        fullName: "Giám Khảo Chấm Thi",
        isAdmin: false,
        isApproved: true,
        isFpt: true,
        isStudent: false,
        UserID: "usr-judge-01",
        FullName: "Giám Khảo Chấm Thi",
        IsAdmin: false,
      };
      newRole = {
        eventRoleId: "er-judge-200",
        userId: "usr-judge-01",
        roleName: "Judge",
        EventRoleId: "er-judge-200",
        UserId: "usr-judge-01",
        RoleName: "Judge",
        assignedEventIds: ["event-seal-2026"],
        AssignedEventIds: ["event-seal-2026"],
      };
      targetPath = "/events";
    } else {
      newUser = {
        id: "usr-student-01",
        userId: "usr-student-01",
        email: "student1@example.com",
        fullName: "Sinh Viên Thí Sinh",
        isAdmin: false,
        isApproved: true,
        isFpt: true,
        isStudent: true,
        UserID: "usr-student-01",
        FullName: "Sinh Viên Thí Sinh",
        IsAdmin: false,
      };
      newRole = {
        eventRoleId: "er-student-300",
        userId: "usr-student-01",
        roleName: roleName === "TeamMember" ? "TeamMember" : "TeamLeader",
        EventRoleId: "er-student-300",
        UserId: "usr-student-01",
        RoleName: roleName === "TeamMember" ? "TeamMember" : "TeamLeader",
      };
      targetPath = "/my-team";
    }

    saveSession(newUser, newRole);
    return targetPath;
  };

  const loginWithEmail = (email: string): string => {
    const found = PRESET_ACCOUNTS.find((acc) => acc.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      return loginWithRole(found.roleName);
    }
    return loginWithRole("TeamLeader");
  };

  const login = (roleName: string = "TeamLeader") => {
    return loginWithRole(roleName);
  };

  const loginWithCredentials = async (email: string, password: string): Promise<string> => {
    const res = await apiClient.post<any>("/Auth/login", { email: email.trim(), password });
    const d = res.data ?? {};
    const accessToken = d.accessToken ?? d.AccessToken;
    const refreshToken = d.refreshToken ?? d.RefreshToken;
    if (!accessToken) throw new Error("Phản hồi đăng nhập thiếu token.");

    const userId = d.userId ?? d.UserId;
    const isAdmin = Boolean(d.isAdmin ?? d.IsAdmin);
    const isStudent = Boolean(d.isStudent ?? d.IsStudent);
    const fullName = d.fullName ?? d.FullName ?? "";
    const authUser: User = {
      id: userId,
      userId,
      email: d.email ?? d.Email ?? email.trim(),
      fullName,
      isAdmin,
      isStudent,
      isApproved: true,
      isFpt: false,
      UserID: userId,
      FullName: fullName,
      IsAdmin: isAdmin,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    }

    // Lấy vai trò THẬT từ backend cho TẤT CẢ các tài khoản
    let primaryRole: EventRole | null = null;
    let targetPath = isAdmin ? "/admin/dashboard" : "/events";
    const normalizedEmail = (d.email ?? d.Email ?? email).toLowerCase();

    try {
      const rolesRes = await apiClient.get<any>("/EventRoles/user", {
        params: { UserId: userId, PageSize: 200 },
      });
      const rows: any[] = rolesRes.data?.data ?? rolesRes.data ?? [];
      const norm = rows.map((r) => ({
        eventId: r.eventId ?? r.EventId,
        roleName: r.roleName ?? r.RoleName,
      }));
      // Ưu tiên vai trò nghiệp vụ cao nhất
      const rank = ["EventCoordinator", "Judge", "Mentor", "TeamLeader", "TeamMember"];
      const chosen = rank.map((rn) => norm.find((r) => r.roleName === rn)).find(Boolean);
      if (chosen) {
        const assigned = norm
          .filter((r) => r.roleName === chosen.roleName)
          .map((r) => r.eventId)
          .filter(Boolean);
        primaryRole = {
          eventRoleId: `real-${chosen.roleName}-${userId}`,
          userId,
          roleName: chosen.roleName,
          EventRoleId: `real-${chosen.roleName}-${userId}`,
          UserId: userId,
          RoleName: chosen.roleName,
          assignedEventIds: assigned,
          AssignedEventIds: assigned,
        } as EventRole;
        targetPath = REDIRECT_BY_ROLE[chosen.roleName] ?? "/events";
      } else if (normalizedEmail.includes("ec_") || normalizedEmail.includes("ec.") || normalizedEmail.includes("coordinator")) {
        targetPath = "/coordinator/dashboard";
      } else if (normalizedEmail.includes("judge")) {
        targetPath = "/judge/tracks";
      } else if (normalizedEmail.includes("mentor")) {
        targetPath = "/mentor/tracks";
      } else if (isAdmin) {
        targetPath = "/admin/dashboard";
      }
    } catch {
      if (normalizedEmail.includes("ec_") || normalizedEmail.includes("ec.") || normalizedEmail.includes("coordinator")) {
        targetPath = "/coordinator/dashboard";
      } else if (normalizedEmail.includes("judge")) {
        targetPath = "/judge/tracks";
      } else if (normalizedEmail.includes("mentor")) {
        targetPath = "/mentor/tracks";
      } else if (isAdmin) {
        targetPath = "/admin/dashboard";
      }
    }

    // Lưu phiên trực tiếp — KHÔNG qua saveSession vì saveSession tự gọi lại
    // /Auth/login với mật khẩu cứng "123456" (chỉ dùng cho tài khoản mock).
    setUser(authUser);
    setActiveRole(primaryRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(authUser));
      if (primaryRole) localStorage.setItem("activeRole", JSON.stringify(primaryRole));
      else localStorage.removeItem("activeRole");
    }
    return targetPath;
  };

  const loginWithGoogleCredential = async (idToken: string): Promise<string> => {
    const res = await apiClient.post<any>("/Auth/google-login", { idToken: idToken.trim() });
    const d = res.data?.data ?? res.data ?? {};
    const accessToken = d.accessToken ?? d.AccessToken ?? d.token ?? d.Token;
    const refreshToken = d.refreshToken ?? d.RefreshToken;
    if (!accessToken) throw new Error("Phản hồi Google Login thiếu token xác thực.");

    const userId = d.userId ?? d.UserId ?? d.user?.id ?? d.user?.userId;
    const isAdmin = Boolean(d.isAdmin ?? d.IsAdmin ?? d.user?.isAdmin);
    const isStudent = Boolean(d.isStudent ?? d.IsStudent ?? d.user?.isStudent);
    const fullName = d.fullName ?? d.FullName ?? d.user?.fullName ?? "";
    const email = d.email ?? d.Email ?? d.user?.email ?? "";
    const isApproved = d.isApproved ?? d.IsApproved ?? d.user?.isApproved ?? false;

    const authUser: User = {
      id: userId,
      userId,
      email,
      fullName,
      isAdmin,
      isStudent,
      isApproved,
      isFpt: email.toLowerCase().endsWith("@fpt.edu.vn"),
      UserID: userId,
      FullName: fullName,
      IsAdmin: isAdmin,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    }

    let primaryRole: EventRole | null = null;
    let targetPath = isAdmin ? "/admin/dashboard" : isStudent ? (isApproved ? "/events" : "/onboarding/profile") : "/events";

    try {
      const rolesRes = await apiClient.get<any>("/EventRoles/user", {
        params: { UserId: userId, PageSize: 200 },
      });
      const rows: any[] = rolesRes.data?.data ?? rolesRes.data ?? [];
      const norm = rows.map((r) => ({
        eventId: r.eventId ?? r.EventId,
        roleName: r.roleName ?? r.RoleName,
      }));
      const rank = ["EventCoordinator", "Judge", "Mentor", "TeamLeader", "TeamMember"];
      const chosen = rank.map((rn) => norm.find((r) => r.roleName === rn)).find(Boolean);
      if (chosen) {
        const assigned = norm
          .filter((r) => r.roleName === chosen.roleName)
          .map((r) => r.eventId)
          .filter(Boolean);
        primaryRole = {
          eventRoleId: `real-${chosen.roleName}-${userId}`,
          userId,
          roleName: chosen.roleName,
          EventRoleId: `real-${chosen.roleName}-${userId}`,
          UserId: userId,
          RoleName: chosen.roleName,
          assignedEventIds: assigned,
          AssignedEventIds: assigned,
        } as EventRole;
        targetPath = REDIRECT_BY_ROLE[chosen.roleName] ?? "/events";
      }
    } catch {
      // fallback targetPath
    }

    setUser(authUser);
    setActiveRole(primaryRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(authUser));
      if (primaryRole) localStorage.setItem("activeRole", JSON.stringify(primaryRole));
      else localStorage.removeItem("activeRole");
    }
    return targetPath;
  };

  const logout = () => {
    setUser(null);
    setActiveRole(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("activeRole");
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
  };

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "805216331270-kmjdrat53j8oa0c7sg6cqbag12a8q9iv.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthContext.Provider
        value={{
          user,
          activeRole,
          isInitialized,
          login,
          loginWithRole,
          loginWithEmail,
          loginWithCredentials,
          loginWithGoogleCredential,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
