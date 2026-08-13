// System DTO Models mapped 100% with Backend .NET Entities (SRS §3 & §10)

export type UserRole = "Admin" | "Coordinator" | "Judge" | "Mentor" | "TeamLeader" | "TeamMember" | "Guest";

export type TeamStatus = "Forming" | "PendingApproval" | "Registered" | "Disqualified";

export type SubmissionStatus = "Submitted" | "Graded" | "Eliminated";

export type AppealStatus = "Filed" | "Approved" | "Rejected";

export interface UserDTO {
  userId: string;
  email: string;
  fullName: string;
  school?: string;
  studentId?: string;
  avatarUrl?: string;
  isAdmin: boolean;
}

export interface EventDTO {
  eventId: string;
  eventName: string;
  season: string;
  year: number;
  tagline?: string;
  description?: string;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  maxTeams: number;
  teamCount: number;
  totalPrizeVnd: number;
}

export interface TeamDTO {
  teamId: string;
  eventId: string;
  eventName: string;
  description?: string;
  status: TeamStatus;
  createdAt: string;
}

export interface TeamMemberDTO {
  eventRoleId: string;
  userId: string;
  fullName: string;
  email: string;
  roleName: "TeamLeader" | "TeamMember";
  isApproved: boolean;
  school?: string;
}

export interface SubmitResultDTO {
  submitResultId: string;
  teamId: string;
  trackId: string;
  roundId: string;
  submissionUrl: string;
  description?: string;
  submissionCount: number; // BR-11: Tối đa 3 lần nộp
  submittedAt: string;
  isActive: boolean;
  isEliminated: boolean;
}

export interface AppealDTO {
  appealId: string;
  submissionId: string;
  teamId: string;
  teamName: string;
  reason: string;
  status: AppealStatus;
  responseReason?: string;
  createdAt: string;
  respondedAt?: string;
}
