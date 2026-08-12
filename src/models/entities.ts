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
