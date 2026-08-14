"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
  // Kiểu string (khớp đúng phần thân hàm bên dưới) — trước đây khai literal
  // union rồi cast "as any" ở chỗ Provider value để né lỗi kiểu, tức là
  // TypeScript coi như không check gì cả. Giờ khai đúng kiểu thật, bỏ "as any".
  loginWithRole: (roleName: string) => string;
  loginWithEmail: (email: string) => string;
  // Đăng nhập THẬT bằng email + mật khẩu người dùng nhập: gọi /Auth/login lấy
  // token thật, lấy vai trò thật từ /EventRoles/user. Ném lỗi nếu sai để form
  // hiện thông báo, KHÔNG gán token giả rồi để bị đá ra sau vài giây.
  loginWithCredentials: (email: string, password: string) => Promise<string>;
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
          } else {
            localStorage.setItem("accessToken", `mock-jwt-token-${newUser.id || newUser.userId}`);
          }
        })
        .catch(() => {
          localStorage.setItem("accessToken", `mock-jwt-token-${newUser.id || newUser.userId}`);
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
        email: "admin.system@seal.edu.vn",
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
        email: "ec.coordinator@seal.edu.vn",
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
        // hasEventPermission() không còn fallback ngầm — role mock phải tự
        // khai rõ mình được gán event nào, không để hàm check quyền tự đoán.
        assignedEventIds: ["event-seal-2026"],
        AssignedEventIds: ["event-seal-2026"],
      };
      targetPath = "/coordinator/dashboard";
    } else if (roleName === "Mentor") {
      newUser = {
        id: "usr-[#2dd4bf]",
        userId: "usr-mentor-01",
        email: "mentor.ai@seal.edu.vn",
        fullName: "Cố Vấn Chuyên Môn AI",
        isAdmin: false,
        isApproved: true,
        isFpt: true,
        isStudent: false,
        UserID: "usr-mentor-01",
        FullName: "Cố Vấn Chuyên Môn AI",
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
        email: "judge.ai@seal.edu.vn",
        fullName: "Giám Khảo Trí Tuệ Nhân Tạo",
        isAdmin: false,
        isApproved: true,
        isFpt: true,
        isStudent: false,
        UserID: "usr-judge-01",
        FullName: "Giám Khảo Trí Tuệ Nhân Tạo",
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
        id: "usr-leader-01",
        userId: "usr-leader-01",
        email: "leader.cybershield@fpt.edu.vn",
        fullName: "Trưởng Nhóm CyberShield",
        isAdmin: false,
        isApproved: true,
        isFpt: true,
        isStudent: true,
        UserID: "usr-leader-01",
        FullName: "Trưởng Nhóm CyberShield",
        IsAdmin: false,
      };
      newRole = {
        eventRoleId: "er-leader-300",
        userId: "usr-leader-01",
        roleName: roleName === "TeamMember" ? "TeamMember" : "TeamLeader",
        EventRoleId: "er-leader-300",
        UserId: "usr-leader-01",
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

  return (
    <AuthContext.Provider value={{ user, activeRole, isInitialized, login, loginWithRole, loginWithEmail, loginWithCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
