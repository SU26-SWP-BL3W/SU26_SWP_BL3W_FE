"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User, EventRole } from "@/models/entities";

interface AuthContextType {
  user: User | null;
  activeRole: EventRole | null;
  login: (mockRole?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<EventRole | null>(null);

  // Mock login để thuận tiện phát triển giao diện trước khi nối API
  const login = (mockRole: string = "TeamLeader") => {
    setUser({
      userId: "mock-user-1",
      email: "mock@fpt.edu.vn",
      fullName: "Nguyễn Văn Thí Sinh",
      isAdmin: mockRole === "Admin",
      UserID: "mock-user-1",
      FullName: "Nguyễn Văn Thí Sinh",
      IsAdmin: mockRole === "Admin",
    });

    if (mockRole !== "Admin") {
      setActiveRole({
        eventRoleId: "er1",
        userId: "mock-user-1",
        roleName: mockRole,
        EventRoleId: "er1",
        UserId: "mock-user-1",
        RoleName: mockRole,
      });
    } else {
      setActiveRole(null);
    }
  };

  const logout = () => {
    setUser(null);
    setActiveRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, activeRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
