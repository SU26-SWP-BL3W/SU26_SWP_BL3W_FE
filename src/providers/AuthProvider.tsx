"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, EventRole } from "@/models/entities";

export interface PresetAccount {
  email: string;
  roleName: "Admin" | "Coordinator" | "Judge" | "TeamLeader";
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
    email: "judge.ai@seal.edu.vn",
    roleName: "Judge",
    fullName: "Giám Khảo Trí Tuệ Nhân Tạo (Judge)",
    defaultRedirect: "/judge/events",
  },
  {
    email: "leader.cybershield@fpt.edu.vn",
    roleName: "TeamLeader",
    fullName: "Trưởng Nhóm CyberShield (Team Leader)",
    defaultRedirect: "/my-team",
  },
];

interface AuthContextType {
  user: User | null;
  activeRole: EventRole | null;
  isInitialized: boolean;
  loginWithRole: (roleName: "Admin" | "Coordinator" | "Judge" | "TeamLeader") => string;
  loginWithEmail: (email: string) => string;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<EventRole | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Khôi phục phiên làm việc từ localStorage khi load/reload trang (F5)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      const storedRole = localStorage.getItem("activeRole");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedRole) {
        setActiveRole(JSON.parse(storedRole));
      }
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
      localStorage.setItem("accessToken", `mock-jwt-token-${newUser.UserID}`);
      if (newRole) {
        localStorage.setItem("activeRole", JSON.stringify(newRole));
      } else {
        localStorage.removeItem("activeRole");
      }
    }
  };

  const loginWithRole = (roleName: "Admin" | "Coordinator" | "Judge" | "TeamLeader"): string => {
    let newUser: User;
    let newRole: EventRole | null = null;
    let targetPath = "/";

    if (roleName === "Admin") {
      newUser = {
        UserID: "usr-admin-01",
        Email: "admin.system@seal.edu.vn",
        FullName: "Quản Trị Viên Hệ Thống (System Admin)",
        IsAdmin: true,
        IsApproved: true,
        IsFpt: true,
      };
      newRole = null;
      targetPath = "/admin/dashboard";
    } else if (roleName === "Coordinator") {
      newUser = {
        UserID: "usr-ec-01",
        Email: "ec.coordinator@seal.edu.vn",
        FullName: "Điều Phối Viên Sự Kiện (Event Coordinator)",
        IsAdmin: false,
        IsApproved: true,
        IsFpt: true,
      };
      newRole = {
        EventRoleId: "er-ec-100",
        UserId: "usr-ec-01",
        EventId: "seal-2026-mua-he",
        RoleName: "Coordinator",
      };
      targetPath = "/coordinator/dashboard";
    } else if (roleName === "Judge") {
      newUser = {
        UserID: "usr-judge-01",
        Email: "judge.ai@seal.edu.vn",
        FullName: "Giám Khảo Chuyên Chấm (Judge)",
        IsAdmin: false,
        IsApproved: true,
        IsFpt: true,
      };
      newRole = {
        EventRoleId: "er-judge-100",
        UserId: "usr-judge-01",
        EventId: "seal-2026-mua-he",
        RoleName: "Judge",
      };
      targetPath = "/judge/events";
    } else {
      newUser = {
        UserID: "usr-team-01",
        Email: "leader.cybershield@fpt.edu.vn",
        FullName: "Trưởng Nhóm CyberShield (Team Leader)",
        IsAdmin: false,
        IsApproved: true,
        IsFpt: true,
      };
      newRole = {
        EventRoleId: "er-tl-100",
        UserId: "usr-team-01",
        EventId: "seal-2026-mua-he",
        RoleName: "TeamLeader",
      };
      targetPath = "/my-team";
    }

    saveSession(newUser, newRole);
    return targetPath;
  };

  const loginWithEmail = (email: string): string => {
    const matchedPreset = PRESET_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (matchedPreset) {
      return loginWithRole(matchedPreset.roleName);
    }
    // Fallback: Nếu gõ email ngẫu nhiên có chữ admin -> Admin, ec/coord -> EC, judge -> Judge, khác -> Team
    const lower = email.toLowerCase();
    if (lower.includes("admin")) return loginWithRole("Admin");
    if (lower.includes("coord") || lower.includes("ec")) return loginWithRole("Coordinator");
    if (lower.includes("judge")) return loginWithRole("Judge");
    return loginWithRole("TeamLeader");
  };

  const logout = () => {
    setUser(null);
    setActiveRole(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("activeRole");
      localStorage.removeItem("accessToken");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        isInitialized,
        loginWithRole,
        loginWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
