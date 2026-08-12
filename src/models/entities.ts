export interface User {
  UserID: string;
  SchoolId?: string;
  Email: string;
  PasswordHash?: string;
  FullName: string;
  StudentId?: string;
  IsAdmin: boolean;
  IsApproved: boolean;
  IsFpt: boolean;
  PhotoStudentCardUrl?: string;
}

export interface EventRole {
  EventRoleId: string;
  UserId: string;
  EventId: string;
  TeamId?: string;
  TrackId?: string;
  RoleName: string;
}

export interface EventEntity {
  EventId: string;
  EventName: string;
  Season: string;
  Year: number;
  StartDate: string;
  EndDate: string;
  RegistrationStartDate?: string;
  RegistrationEndDate?: string;
  Description?: string;
  Status?: string;
}

export interface RoundEntity {
  RoundId: string;
  EventId: string;
  RoundName: string;
  RoundNumber: number;
  StartDate: string;
  EndDate: string;
  AdvancementRule?: string; // e.g. "top 10", "percent 50", "minScore 7.0"
}

export interface TrackEntity {
  TrackId: string;
  RoundId: string;
  TemplateId?: string;
  TrackName: string;
  Description?: string;
  SubmissionRuleDescription?: string;
}

export interface TemplateEntity {
  TemplateId: string;
  TemplateName: string;
  Description?: string;
}

export interface CriteriaEntity {
  CriteriaId: string;
  CriterionName: string;
  Description?: string;
  MaxScore: number;
  Weight: number;
  IsActive?: boolean;
}

export interface TemplateCriteriaEntity {
  TemplateId: string;
  CriteriaId: string;
  CriterionName?: string;
  Description?: string;
  Weight: number;
  MaxScore: number;
}

export interface EventRoleInvitationEntity {
  InvitationId: string;
  EventId: string;
  TrackId?: string;
  Email: string;
  RoleName: 'Judge' | 'Mentor' | 'EventCoordinator';
  Status: 'Pending' | 'Accepted' | 'Rejected' | 'Expired';
  ExpiredAt: string;
}

