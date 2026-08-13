"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, EventRole } from "@/models/entities";

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
  login: (roleName?: string) => string;
  loginWithRole: (roleName: "Admin" | "Coordinator" | "Judge" | "TeamLeader" | "Mentor" | "TeamMember") => string;
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
      localStorage.setItem("accessToken", `mock-jwt-token-${newUser.id || newUser.userId}`);
      if (newRole) {
        localStorage.setItem("activeRole", JSON.stringify(newRole));
      } else {
        localStorage.removeItem("activeRole");
      }
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
    <AuthContext.Provider value={{ user, activeRole, isInitialized, login, loginWithRole: loginWithRole as any, loginWithEmail, logout }}>
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
