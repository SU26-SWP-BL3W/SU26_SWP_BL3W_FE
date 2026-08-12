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
      UserID: "mock-user-1",
      Email: "mock@fpt.edu.vn",
      FullName: "Mock User",
      IsAdmin: mockRole === "Admin",
      IsApproved: true,
      IsFpt: true,
    });

    if (mockRole !== "Admin") {
      setActiveRole({
        EventRoleId: "er1",
        UserId: "mock-user-1",
        EventId: "event-1",
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
