// ============================================================
// SEAL Hackathon — Core Entity Interfaces
// Synced with backend Swagger: https://api.sealswp391.xyz
// NOTE: API returns camelCase — these interfaces match the API response shape.
// Optional PascalCase & helper fields are included for backward-compatibility with legacy mock data.
// ============================================================

// ─── Auth / User ─────────────────────────────────────────────

/** Matches backend UserModel (GET /api/Users, POST /api/Auth/login response) */
export interface User {
  id?: string;
  userId?: string;
  schoolId?: string | null;
  schoolName?: string | null;
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
  studentCardPhotoUrl?: string | null;
  rejectionCount?: number;
  rejectedCount?: number;
  rejectionReason?: string | null;
  createdTime?: string;
  lastUpdatedTime?: string;

  // Legacy aliases
  UserID?: string;
  Email?: string;
  FullName?: string;
  IsAdmin?: boolean;
  IsApproved?: boolean;
  IsFpt?: boolean;
}

/** POST /api/Auth/login response */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/** POST /api/Auth/register request body */
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

/** POST/PUT /api/Auth/student-profiles request body */
export interface UpdateStudentProfileRequest {
  schoolId?: string | null;
  studentCode?: string | null;
  isFpt?: boolean;
}

/** GET /api/Auth/fpt-student-verification response */
export interface FptStudentResponse {
  studentCode: string;
  fullName: string;
  email: string;
  isFpt: boolean;
  isVerified?: boolean;
}

// ─── User Rejection ──────────────────────────────────────────

/** Matches backend UserRejectionModel (GET /api/UserRejections/user/{userId}) */
export interface UserRejection {
  id?: string;
  userId?: string;
  rejectedBy?: string;
  reason?: string | null;
  isActive?: boolean;
  createdTime?: string;
}

// ─── School ──────────────────────────────────────────────────

export interface School {
  id?: string;
  schoolId?: string;
  schoolName?: string;
  SchoolName?: string;
  code?: string | null;
  address?: string | null;
}

// ─── Event ───────────────────────────────────────────────────

export interface EventEntity {
  id?: string;
  eventId?: string;
  eventName?: string;
  season?: string;
  year?: number;
  startDate?: string;
  endDate?: string;
  registrationStartDate?: string | null;
  registrationEndDate?: string | null;
  description?: string | null;
  status?: boolean;
  photoEventUrl?: string | null;
  maxTeams?: number;
  minTeamSize?: number;
  maxTeamSize?: number;

  // Legacy aliases
  EventId?: string;
  EventName?: string;
  Season?: string;
  Year?: number;
  StartDate?: string;
  EndDate?: string;
  RegistrationStartDate?: string | null;
  RegistrationEndDate?: string | null;
  Description?: string | null;
  PhotoEventUrl?: string | null;
}

/** Legacy type alias */
export type Event = EventEntity;

// ─── Round ───────────────────────────────────────────────────

export interface RoundEntity {
  id?: string;
  roundId?: string;
  eventId?: string;
  roundNumber?: number;
  roundName?: string;
  startDate?: string;
  endDate?: string;
  advancementRule?: string | null;
  description?: string | null;

  // Legacy aliases
  RoundId?: string;
  EventId?: string;
  RoundNumber?: number;
  RoundName?: string;
  StartDate?: string;
  EndDate?: string;
}

/** Legacy type alias */
export type Round = RoundEntity;

// ─── Track ───────────────────────────────────────────────────

export interface TrackEntity {
  id?: string;
  trackId?: string;
  eventId?: string;
  trackName?: string;
  description?: string | null;

  // Legacy aliases
  TrackId?: string;
  EventId?: string;
  TrackName?: string;
  Description?: string | null;
}

/** Legacy type alias */
export type Track = TrackEntity;

// ─── Criteria & Template ──────────────────────────────────────

export interface Criteria {
  id?: string;
  criteriaId?: string;
  criteriaName?: string;
  description?: string | null;
  maxScore?: number;
  weight?: number;
  isActive?: boolean;
}

export interface CriteriaEntity extends Criteria {
  criterionName?: string | null;
  CriteriaId?: string;
  CriterionName?: string;
  Description?: string;
  Weight?: number;
  MaxScore?: number;
  IsActive?: boolean;
}

export interface TemplateCriteriaEntity {
  criteriaId?: string;
  criteriaName?: string | null;
  description?: string | null;
  weight?: number;
  maxScore?: number;

  TemplateId?: string;
  CriteriaId?: string;
  CriterionName?: string;
  Description?: string;
  Weight?: number;
  MaxScore?: number;
}

export interface Template {
  id?: string;
  templateId?: string;
  TemplateId?: string;
  name?: string;
  templateName?: string;
  TemplateName?: string;
  description?: string | null;
  criterias?: Criteria[];
  totalWeight?: number;
}

// ─── EventRole ───────────────────────────────────────────────

/** EventRoleType enum: 0=TeamLeader,1=TeamMember,2=Judge,3=Mentor,4=EventCoordinator */
export type EventRoleType = 0 | 1 | 2 | 3 | 4;
export const EventRoleTypeMap: Record<EventRoleType, string> = {
  0: 'TeamLeader',
  1: 'TeamMember',
  2: 'Judge',
  3: 'Mentor',
  4: 'EventCoordinator',
};

export interface EventRole {
  id?: string;
  eventRoleId?: string;
  userId?: string;
  eventId?: string;
  teamId?: string | null;
  teamName?: string | null;
  trackId?: string | null;
  roleName?: string;
  roleNameDetail?: string;
  expiredAt?: string | null;

  // Legacy aliases
  EventRoleId?: string;
  RoleName?: string;
  UserId?: string;
  EventId?: string;
  TrackId?: string;
  TeamId?: string | null;
}

export interface EventRoleInvitation {
  id?: string;
  invitationId?: string;
  eventId?: string;
  trackId?: string | null;
  email?: string | null;
  roleName?: string;
  status?: 'Pending' | 'Accepted' | 'Rejected' | 'Expired' | string;
  expiresAt?: string;
  respondedAt?: string | null;
  type?: string | null;
  targetName?: string | null;
  inviterName?: string | null;
  trackName?: string | null;

  // Legacy aliases
  InvitationId?: string;
  EventId?: string;
  RoleName?: string;
  Status?: string;
  ExpiresAt?: string;
  ExpiredAt?: string;
  TrackId?: string | null;
  Email?: string | null;
  TargetName?: string | null;
}

/** Legacy type alias */
export type EventRoleInvitationEntity = EventRoleInvitation;

// ─── Team ────────────────────────────────────────────────────

export type TeamStatus = 'Forming' | 'PendingApproval' | 'Registered' | 'Disqualified' | 'Rejected';

export interface TeamEntity {
  id?: string;
  teamId?: string;
  eventId?: string;
  leaderId?: string;
  leaderUserId?: string;
  teamName?: string;
  name?: string;
  description?: string | null;
  status?: TeamStatus;
  rejectReason?: string | null;
  createdTime?: string;
  lastUpdatedTime?: string;
  members?: TeamMemberModel[];
  invitations?: TeamInvitation[];

  // Legacy aliases
  TeamId?: string;
  EventId?: string;
  TeamName?: string;
  Status?: TeamStatus;
}

export type Team = TeamEntity;

export interface TeamInvitation {
  id?: string;
  teamId?: string;
  teamName?: string;
  email?: string;
  invitedEmail?: string;
  invitedByName?: string;
  status?: 'Pending' | 'Accepted' | 'Declined' | 'Expired' | string;
  sentAt?: string;
  expiresAt?: string;
  createdTime?: string;
}

export interface TeamMemberModel {
  id?: string;
  teamId?: string;
  userId?: string;
  fullName?: string | null;
  email?: string | null;
  studentCode?: string | null;
  roleName?: string | null;
  role?: string | null;
  isLeader?: boolean;
  isApproved?: boolean;
  joinedTime?: string;
  user?: User;
}

export type TeamMember = TeamMemberModel;

// ─── Submission ──────────────────────────────────────────────

export interface SubmitResult {
  id?: string;
  submitResultId?: string;
  teamId?: string;
  teamName?: string;
  trackId?: string;
  roundId?: string;
  submissionUrl?: string | null;
  description?: string | null;
  submittedAt?: string;
  isActive?: boolean;
  isEliminated?: boolean;
  eliminatedReason?: string | null;
  createdTime?: string;
  lastUpdatedTime?: string;
}

// ─── Score ───────────────────────────────────────────────────

export interface Score {
  id?: string;
  eventRoleId?: string;
  submitResultId?: string;
  totalScore?: number;
  comment?: string | null;
  isSubmitted?: boolean;
  createdTime?: string;
  lastUpdatedTime?: string;
  criteriaScores?: CriteriaScore[];
}

export interface CriteriaScore {
  id?: string;
  scoreId?: string;
  criteriaId?: string;
  scoreValue?: number;
}

export interface SaveScoreRequest {
  submitResultId: string;
  judgeId?: string;
  isSubmitted: boolean;
  scores: {
    criteriaId: string;
    scoreValue: number;
  }[];
  comment?: string;
}

export interface ScoreBreakdownModel {
  teamId: string;
  teamName: string;
  trackId?: string;
  trackName?: string;
  totalScore: number;
  details: {
    criteriaId: string;
    criteriaName: string;
    scoreValue: number;
    maxScore: number;
    weight: number;
  }[];
}

export interface CalibrationItem {
  judgeId: string;
  judgeName: string;
  submitResultId: string;
  teamName: string;
  totalScore: number;
  isSubmitted: boolean;
}

export interface CalibrationModel {
  trackId: string;
  trackName: string;
  isCompleted?: boolean;
  scores?: CalibrationItem[];
  judges?: Array<{ id: string; fullName: string }>;
  teams?: Array<{
    teamId: string;
    teamName: string;
    scores: Array<{ judgeId: string; scoreValue: number; isSubmitted: boolean }>;
    averageScore: number;
  }>;
}

// ─── Final Result / Prize ────────────────────────────────────

export interface Prize {
  id?: string;
  eventId?: string;
  trackId?: string | null;
  prizeName?: string;
  rewardAmount?: number;
  quantity?: number;
  description?: string | null;
}

export interface FinalResult {
  id?: string;
  teamId?: string;
  teamName?: string;
  roundId?: string;
  eventId?: string | null;
  trackId?: string | null;
  prizeId?: string | null;
  prizeName?: string | null;
  rewardAmount?: number;
  finalScore?: number;
  rank?: number;
  isAdvanced?: boolean;
  isPublished?: boolean;
  createdTime?: string;
  lastUpdatedTime?: string;
}

// ─── Appeal ──────────────────────────────────────────────────

export type AppealStatus = 0 | 1 | 2; // Pending=0, Approved=1, Rejected=2

export interface Appeal {
  id?: string;
  submitResultId?: string;
  teamId?: string;
  teamName?: string;
  reason?: string | null;
  status?: AppealStatus;
  response?: string | null;
  assignedJudgeId?: string | null;
  createdTime?: string;
  lastUpdatedTime?: string;
}

// ─── Base / Paged Generic Responses ──────────────────────────

export interface BaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  success?: boolean;
}

export interface PagedResult<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  data: T[];
}
