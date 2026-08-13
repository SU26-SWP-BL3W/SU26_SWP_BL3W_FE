"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, EventRole } from "@/models/entities";

export interface PresetAccount {
  id: string;
  email: string;
  roleName:
    | "Admin"
    | "Coordinator"
    | "Judge"
    | "Mentor"
    | "TeamLeader"
    | "TeamMember"
    | "InvitedStudent"
    | "NonFptStudentLocked";
  fullName: string;
  description: string;
  defaultRedirect: string;
}

export const PRESET_ACCOUNTS: PresetAccount[] = [
  {
    id: "preset-admin",
    email: "admin.system@seal.edu.vn",
    roleName: "Admin",
    fullName: "Quản Trị Viên (System Admin)",
    description: "Khởi tạo sự kiện, tạo trường học, gán Event Coordinator",
    defaultRedirect: "/admin/dashboard",
  },
  {
    id: "preset-ec",
    email: "ec.coordinator@seal.edu.vn",
    roleName: "Coordinator",
    fullName: "Điều Phối Viên (Event Coordinator)",
    description: "Duyệt hồ sơ SV, duyệt Đội thi, hiệu chuẩn điểm, gán giải thưởng, công bố kết quả",
    defaultRedirect: "/coordinator/dashboard",
  },
  {
    id: "preset-judge",
    email: "judge.ai@seal.edu.vn",
    roleName: "Judge",
    fullName: "Giám Khảo (Judge - AI Track)",
    description: "Chấm điểm bài thi theo Tiêu chí Template, lưu nháp & chốt bảng điểm",
    defaultRedirect: "/judge/scoring",
  },
  {
    id: "preset-mentor",
    email: "mentor.cybershield@seal.edu.vn",
    roleName: "Mentor",
    fullName: "Cố Vấn Hỗ Trợ (Mentor)",
    description: "Theo dõi tiến độ & phân rã điểm số theo tiêu chí của đội thi",
    defaultRedirect: "/mentor/progress",
  },
  {
    id: "preset-leader",
    email: "leader.cybershield@fpt.edu.vn",
    roleName: "TeamLeader",
    fullName: "Trưởng Nhóm CyberShield (Team Leader)",
    description: "Trạng thái Registered: Mời thành viên, nộp bài thi, gửi đơn phúc khảo",
    defaultRedirect: "/my-team",
  },
  {
    id: "preset-member",
    email: "member.cybershield@fpt.edu.vn",
    roleName: "TeamMember",
    fullName: "Thành Viên Đội CyberShield (Team Member)",
    description: "Xem thông tin đội thi, xem lịch sử bài nộp & xem Bảng xếp hạng",
    defaultRedirect: "/my-team",
  },
  {
    id: "preset-invited",
    email: "student.invited@fpt.edu.vn",
    roleName: "InvitedStudent",
    fullName: "Sinh Viên Có Lời Mời Vào Đội",
    description: "Có lời mời tham gia đội thi đang chờ phản hồi Accept/Decline",
    defaultRedirect: "/my-invitations",
  },
  {
    id: "preset-locked",
    email: "student.locked@vlu.edu.vn",
    roleName: "NonFptStudentLocked",
    fullName: "Sinh Viên Bị Khóa 2 Gậy (Locked Student)",
    description: "Tài khoản Non-FPT bị từ chối 2 lần, bị khóa tính năng thi đấu & gửi yêu cầu mở khóa",
    defaultRedirect: "/onboarding",
  },
];

interface AuthContextType {
  user: User | null;
  activeRole: EventRole | null;
  isInitialized: boolean;
  login: (roleName?: string) => string;
  loginWithRole: (roleName: any) => string;
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
    } font-mono:
      setIsInitialized(true);
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

  const loginWithRole = (roleName: string): string => {
    let newUser: User;
    let newRole: EventRole | null = null;
    let targetPath = "/";

    switch (roleName) {
      case "Admin":
        newUser = {
          id: "usr-admin-01",
          email: "admin.system@seal.edu.vn",
          fullName: "Quản Trị Viên (System Admin)",
          isAdmin: true,
          isApproved: true,
          isFpt: true,
          isStudent: false,
        };
        newRole = null;
        targetPath = "/admin/dashboard";
        break;

      case "Coordinator":
        newUser = {
          id: "usr-ec-01",
          email: "ec.coordinator@seal.edu.vn",
          fullName: "Điều Phối Viên (Event Coordinator)",
          isAdmin: false,
          isApproved: true,
          isFpt: true,
          isStudent: false,
        };
        newRole = {
          id: "er-ec-01",
          userId: "usr-ec-01",
          eventId: "seal-2026-mua-he",
          roleName: "Coordinator",
          roleNameDetail: "Event Coordinator",
        };
        targetPath = "/coordinator/dashboard";
        break;

      case "Judge":
        newUser = {
          id: "usr-judge-01",
          email: "judge.ai@seal.edu.vn",
          fullName: "Giám Khảo (Judge - AI Track)",
          isAdmin: false,
          isApproved: true,
          isFpt: false,
          isStudent: false,
        };
        newRole = {
          id: "er-judge-01",
          userId: "usr-judge-01",
          eventId: "seal-2026-mua-he",
          roleName: "Judge",
          roleNameDetail: "Giám Khảo Hạng Mục AI",
        };
        targetPath = "/judge/scoring";
        break;

      case "Mentor":
        newUser = {
          id: "usr-mentor-01",
          email: "mentor.cybershield@seal.edu.vn",
          fullName: "Cố Vấn Hỗ Trợ (Mentor)",
          isAdmin: false,
          isApproved: true,
          isFpt: true,
          isStudent: false,
        };
        newRole = {
          id: "er-mentor-01",
          userId: "usr-mentor-01",
          eventId: "seal-2026-mua-he",
          roleName: "Mentor",
          roleNameDetail: "Cố Vấn Đội Thi",
        };
        targetPath = "/mentor/progress";
        break;

      case "TeamLeader":
        newUser = {
          id: "usr-leader-01",
          email: "leader.cybershield@fpt.edu.vn",
          fullName: "Trưởng Nhóm CyberShield",
          isAdmin: false,
          isApproved: true,
          isFpt: true,
          isStudent: true,
          studentCode: "SE170123",
        };
        newRole = {
          id: "er-leader-01",
          userId: "usr-leader-01",
          eventId: "seal-2026-mua-he",
          roleName: "TeamLeader",
          teamId: "team-1",
          teamName: "CyberShield",
        };
        targetPath = "/my-team";
        break;

      case "TeamMember":
        newUser = {
          id: "usr-member-02",
          email: "member.cybershield@fpt.edu.vn",
          fullName: "Thành Viên Đội CyberShield",
          isAdmin: false,
          isApproved: true,
          isFpt: true,
          isStudent: true,
          studentCode: "SE170456",
        };
        newRole = {
          id: "er-member-02",
          userId: "usr-member-02",
          eventId: "seal-2026-mua-he",
          roleName: "TeamMember",
          teamId: "team-1",
          teamName: "CyberShield",
        };
        targetPath = "/my-team";
        break;

      case "InvitedStudent":
        newUser = {
          id: "usr-invited-03",
          email: "student.invited@fpt.edu.vn",
          fullName: "Sinh Viên Có Lời Mời Vào Đội",
          isAdmin: false,
          isApproved: true,
          isFpt: true,
          isStudent: true,
          studentCode: "SE170888",
        };
        newRole = null;
        targetPath = "/my-invitations";
        break;

      case "NonFptStudentLocked":
        newUser = {
          id: "usr-locked-99",
          email: "student.locked@vlu.edu.vn",
          fullName: "Sinh Viên VLU Bị Khóa Hồ Sơ",
          isAdmin: false,
          isApproved: false,
          isFpt: false,
          isStudent: true,
        };
        newRole = null;
        targetPath = "/onboarding";
        break;

      default:
        newUser = {
          id: "usr-student-gen",
          email: "student@fpt.edu.vn",
          fullName: "Sinh Viên Hợp Lệ",
          isAdmin: false,
          isApproved: true,
          isFpt: true,
          isStudent: true,
        };
        newRole = null;
        targetPath = "/my-team";
        break;
    }

    saveSession(newUser, newRole);
    return targetPath;
  };

  const loginWithEmail = (email: string): string => {
    const preset = PRESET_ACCOUNTS.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
    if (preset) {
      return loginWithRole(preset.roleName);
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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("activeRole");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole,
        isInitialized,
        login,
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
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
