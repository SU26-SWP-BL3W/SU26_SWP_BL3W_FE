// ============================================================
// SEAL Hackathon — Core Entity Interfaces
// Synced with backend Swagger: https://api.sealswp391.xyz
// NOTE: API returns camelCase — these interfaces match the API response shape.
// Optional PascalCase & helper fields are included for backward-compatibility with legacy mock data.
// ============================================================

export type UserRole = "Admin" | "Coordinator" | "Judge" | "Mentor" | "TeamLeader" | "TeamMember" | "Guest";

export type TeamStatus = "Forming" | "PendingApproval" | "Registered" | "Disqualified";

export type SubmissionStatus = "Submitted" | "Graded" | "Eliminated";

// ─── DTO Compatibility Types ─────────────────────────────────────
export interface UserDTO {
  userId?: string;
  email?: string;
  fullName?: string;
  school?: string;
  studentId?: string;
  avatarUrl?: string;
  isAdmin?: boolean;
  UserID?: string;
  FullName?: string;
  StudentId?: string;
  IsAdmin?: boolean;
  // Swagger fields
  id?: string;
  isStudent?: boolean;
  isApproved?: boolean;
  isFpt?: boolean;
  isRejected?: boolean;
}

export interface EventRole {
  eventRoleId?: string;
  userId?: string;
  roleName?: string;
  EventRoleId?: string;
  UserId?: string;
  RoleName?: string;
}

export interface EventDTO {
  eventId: string;
  eventName: string;
  season?: string;
  year?: number;
  tagline?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  maxTeams?: number;
  teamCount?: number;
  totalPrizeVnd?: number;
}

export interface TeamDTO {
  teamId: string;
  eventId: string;
  eventName: string;
  description?: string;
  status: TeamStatus;
  createdAt: string;
}

export interface SubmitResultDTO {
  submitResultId: string;
  teamId: string;
  trackId: string;
  roundId: string;
  submissionUrl: string;
  description?: string;
  submissionCount: number;
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
  status: string;
  responseReason?: string;
  createdAt: string;
  respondedAt?: string;
}

// ─── Auth / User ─────────────────────────────────────────────

/** Matches backend UserModel (GET /api/Users, POST /api/Auth/login response) */
export interface User {
  id?: string;
  userId?: string;
  schoolId?: string | null;
  studentCode?: string | null;
  email?: string;
  fullName?: string;
  isStudent?: boolean;
  isAdmin?: boolean;
  isApproved?: boolean;
  isFpt?: boolean;
  isRejected?: boolean;
  isTemporary?: boolean;
  photoStudentCardUrl?: string | null;
  rejectionReason?: string | null;
  rejectedCount?: number;
  createdTime?: string;
  lastUpdatedTime?: string;
  // Aliases for compatibility
  UserID?: string;
  FullName?: string;
  StudentId?: string;
  IsAdmin?: boolean;
  Email?: string;
  IsApproved?: boolean;
  IsFpt?: boolean;
}

export interface LoginRequest {
  email: string;
  passwordHash: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
  roles?: EventRole[];
}

export interface RegisterRequest {
  email: string;
  passwordHash: string;
  fullName: string;
}

export interface UpdateStudentProfileRequest {
  schoolId?: string;
  studentCode?: string;
  photoStudentCardUrl?: string;
}

export interface FptStudentResponse {
  isFptStudent: boolean;
  studentCode?: string;
  fullName?: string;
}

export interface UserRejection {
  id?: string;
  userId?: string;
  reason?: string;
  rejectedTime?: string;
}

// ─── School ──────────────────────────────────────────────────

export interface School {
  id: string;
  code: string;
  name: string;
  isFpt: boolean;
}

// ─── Event ───────────────────────────────────────────────────

export interface Event {
  id?: string;
  name?: string;
  season?: string;
  year?: number;
  description?: string | null;
  startDate?: string;
  endDate?: string;
  createdTime?: string;
  lastUpdatedTime?: string;
}

// ─── Round ───────────────────────────────────────────────────

export interface Round {
  id?: string;
  eventId?: string;
  name?: string;
  orderNumber?: number;
  startDate?: string;
  endDate?: string;
  submissionDeadline?: string;
  isFinal?: boolean;
}

// ─── Track ───────────────────────────────────────────────────

export interface Track {
  id?: string;
  roundId?: string;
  name?: string;
  description?: string | null;
  maxTeams?: number;
  templateId?: string | null;
}

// ─── Template & Criteria ─────────────────────────────────────

export interface Criteria {
  id?: string;
  name?: string;
  description?: string | null;
  weight?: number;
}

export interface Template {
  id?: string;
  name?: string;
  description?: string | null;
  criterias?: Criteria[];
  totalWeight?: number;
}

// ─── Team ────────────────────────────────────────────────────

export interface Team {
  id?: string;
  eventId?: string;
  name?: string;
  trackId?: string | null;
  leaderUserId?: string;
  isApproved?: boolean;
  createdTime?: string;
}

export interface TeamMember {
  id?: string;
  teamId?: string;
  userId?: string;
  role?: string;
  joinedTime?: string;
  user?: User;
}

export interface TeamInvitation {
  id?: string;
  teamId?: string;
  email?: string;
  status?: string;
  sentAt?: string;
  expiresAt?: string;
}

// ─── SubmitResult ────────────────────────────────────────────

export interface SubmitResult {
  id?: string;
  teamId?: string;
  roundId?: string;
  trackId?: string;
  submissionUrl?: string;
  description?: string | null;
  submittedAt?: string;
  submissionCount?: number;
}

// ─── Appeal ──────────────────────────────────────────────────

export type AppealStatusType = 0 | 1 | 2; // Pending=0, Approved=1, Rejected=2

export interface Appeal {
  id?: string;
  submitResultId?: string;
  reason?: string | null;
  status?: AppealStatusType;
  response?: string | null;
  assignedJudgeId?: string | null;
}

// ─── Pagination ──────────────────────────────────────────────

export interface PagedResult<T> {
  data: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface BaseResponse<T> {
  data: T;
  message?: string | null;
  success: boolean;
}
