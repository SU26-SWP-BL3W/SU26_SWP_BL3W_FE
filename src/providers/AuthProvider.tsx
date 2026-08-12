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
      localStorage.setItem("accessToken", `mock-jwt-token-${newUser.id}`);
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
        id: "usr-admin-01",
        email: "admin.system@seal.edu.vn",
        fullName: "Quản Trị Viên Hệ Thống (System Admin)",
        isAdmin: true,
        isApproved: true,
        isFpt: true,
        isStudent: false,
      };
      newRole = null;
      targetPath = "/admin/dashboard";
    } else if (roleName === "Coordinator") {
      newUser = {
        id: "usr-ec-01",
        email: "ec.coordinator@seal.edu.vn",
        fullName: "Điều Phối Viên Sự Kiện (Event Coordinator)",
        isAdmin: false,
        isApproved: true,
        isFpt: true,
        isStudent: false,
      };
      newRole = {
        id: "er-ec-100",
        userId: "usr-ec-01",
        eventId: "seal-2026-mua-he",
        roleName: "EventCoordinator",
      };
      targetPath = "/coordinator/dashboard";
    } else if (roleName === "Judge") {
      newUser = {
        id: "usr-judge-01",
        email: "judge.ai@seal.edu.vn",
        fullName: "Giám Khảo Chuyên Chấm (Judge)",
        isAdmin: false,
        isApproved: true,
        isFpt: true,
        isStudent: false,
      };
      newRole = {
        id: "er-judge-100",
        userId: "usr-judge-01",
        eventId: "seal-2026-mua-he",
        roleName: "Judge",
      };
      targetPath = "/judge/events";
    } else {
      newUser = {
        id: "usr-team-01",
        email: "leader.cybershield@fpt.edu.vn",
        fullName: "Trưởng Nhóm CyberShield (Team Leader)",
        isAdmin: false,
        isApproved: true,
        isFpt: true,
        isStudent: true,
        studentCode: "SE182704",
      };
      newRole = {
        id: "er-tl-100",
        userId: "usr-team-01",
        eventId: "seal-2026-mua-he",
        roleName: "TeamLeader",
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
    if (matchedPreset) return loginWithRole(matchedPreset.roleName);
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
      localStorage.removeItem("refreshToken");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, activeRole, isInitialized, loginWithRole, loginWithEmail, logout }}
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
