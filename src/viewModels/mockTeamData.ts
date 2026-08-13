// ─── Mock Data: Team Leader Flow ──────────────────────────────────────────────
// Dùng để test UI trước khi có API thực. Thay đổi MOCK_SCENARIO để test các state.

export interface MockRound {
  id: string;
  roundName: string;
  roundNumber: number;
  startDate: string;
  endDate: string;
  eventId: string;
}

export interface MockTrack {
  id: string;
  trackName: string;
  description: string;
  roundId: string;
  templateId: string | null;
}

export type DeliverableType =
  | "github"
  | "slides"
  | "demo_video"
  | "deployed_url"
  | "report"
  | "figma"
  | "other";

export interface MockDeliverable {
  id: string;
  type: DeliverableType;
  label: string;           // Tên hiển thị: "GitHub Repository", "Slides", ...
  placeholder: string;     // gợi ý input
  required: boolean;       // Bắt buộc nộp hay tuỳ chọn
  trackId: string;
}

export interface MockSubmission {
  id: string;
  teamId: string;
  teamName: string;
  trackId: string;
  trackName: string;
  roundId: string;
  roundName: string;
  submissionUrl: string;
  description: string;
  isActive: boolean;
  isEliminated: boolean;
  eliminatedReason?: string;
  createdTime: string;
}

export const MOCK_ROUNDS: MockRound[] = [
  { id: "round-001", roundName: "Vòng Sơ Loại", roundNumber: 1, startDate: "2026-08-01T00:00:00Z", endDate: "2026-08-20T23:59:59Z", eventId: "event-seal-2026" },
  { id: "round-002", roundName: "Vòng Bán Kết", roundNumber: 2, startDate: "2026-08-25T00:00:00Z", endDate: "2026-09-05T23:59:59Z", eventId: "event-seal-2026" },
  { id: "round-003", roundName: "Vòng Chung Kết", roundNumber: 3, startDate: "2026-09-10T00:00:00Z", endDate: "2026-09-15T23:59:59Z", eventId: "event-seal-2026" },
];

export const MOCK_TRACKS: MockTrack[] = [
  { id: "track-001", trackName: "AI & Machine Learning", description: "Các giải pháp ứng dụng AI/ML vào thực tế", roundId: "round-001", templateId: "tmpl-001" },
  { id: "track-002", trackName: "Cloud & DevOps", description: "Hạ tầng cloud, CI/CD, containerization", roundId: "round-001", templateId: "tmpl-001" },
  { id: "track-003", trackName: "Web & Mobile App", description: "Ứng dụng web hoặc mobile có giá trị thực tiễn", roundId: "round-001", templateId: "tmpl-002" },
  { id: "track-004", trackName: "AI & Machine Learning", description: "Các giải pháp ứng dụng AI/ML vào thực tế", roundId: "round-002", templateId: "tmpl-001" },
  { id: "track-005", trackName: "Cloud & DevOps", description: "Hạ tầng cloud, CI/CD, containerization", roundId: "round-002", templateId: "tmpl-001" },
];

// Deliverables theo từng track (mock — thực tế do coordinator cấu hình)
export const MOCK_DELIVERABLES: MockDeliverable[] = [
  // Track 001: AI & ML
  { id: "dlv-001", type: "github",       label: "GitHub Repository",  placeholder: "https://github.com/team/project",   required: true,  trackId: "track-001" },
  { id: "dlv-002", type: "slides",       label: "Slides Thuyết Trình", placeholder: "https://docs.google.com/presentation/...", required: true,  trackId: "track-001" },
  { id: "dlv-003", type: "demo_video",   label: "Demo Video",          placeholder: "https://youtube.com/watch?v=...",   required: false, trackId: "track-001" },
  { id: "dlv-004", type: "report",       label: "Báo Cáo Kỹ Thuật",   placeholder: "https://drive.google.com/file/...",  required: false, trackId: "track-001" },
  // Track 002: Cloud & DevOps
  { id: "dlv-005", type: "github",       label: "GitHub Repository",  placeholder: "https://github.com/team/infra",     required: true,  trackId: "track-002" },
  { id: "dlv-006", type: "deployed_url", label: "URL Ứng Dụng",        placeholder: "https://app.yourdomain.com",         required: true,  trackId: "track-002" },
  { id: "dlv-007", type: "slides",       label: "Slides Thuyết Trình", placeholder: "https://docs.google.com/presentation/...", required: true,  trackId: "track-002" },
  { id: "dlv-008", type: "demo_video",   label: "Demo Video",          placeholder: "https://youtube.com/watch?v=...",   required: false, trackId: "track-002" },
  // Track 003: Web & Mobile
  { id: "dlv-009", type: "github",       label: "GitHub Repository",  placeholder: "https://github.com/team/app",       required: true,  trackId: "track-003" },
  { id: "dlv-010", type: "figma",        label: "Figma Design",        placeholder: "https://www.figma.com/file/...",    required: true,  trackId: "track-003" },
  { id: "dlv-011", type: "deployed_url", label: "URL Ứng Dụng",        placeholder: "https://app.yourdomain.com",         required: true,  trackId: "track-003" },
  { id: "dlv-012", type: "slides",       label: "Slides Thuyết Trình", placeholder: "https://docs.google.com/presentation/...", required: false, trackId: "track-003" },
  { id: "dlv-013", type: "demo_video",   label: "Demo Video",          placeholder: "https://youtube.com/watch?v=...",   required: false, trackId: "track-003" },
  // Track 004: AI&ML Round 2
  { id: "dlv-014", type: "github",       label: "GitHub Repository",  placeholder: "https://github.com/team/project",   required: true,  trackId: "track-004" },
  { id: "dlv-015", type: "slides",       label: "Slides Thuyết Trình", placeholder: "https://docs.google.com/presentation/...", required: true,  trackId: "track-004" },
  { id: "dlv-016", type: "demo_video",   label: "Demo Video",          placeholder: "https://youtube.com/watch?v=...",   required: true,  trackId: "track-004" },
  { id: "dlv-017", type: "report",       label: "Báo Cáo Kỹ Thuật",   placeholder: "https://drive.google.com/file/...",  required: true,  trackId: "track-004" },
  // Track 005: Cloud Round 2
  { id: "dlv-018", type: "github",       label: "GitHub Repository",  placeholder: "https://github.com/team/infra",     required: true,  trackId: "track-005" },
  { id: "dlv-019", type: "deployed_url", label: "URL Ứng Dụng",        placeholder: "https://app.yourdomain.com",         required: true,  trackId: "track-005" },
  { id: "dlv-020", type: "slides",       label: "Slides Thuyết Trình", placeholder: "https://docs.google.com/presentation/...", required: true,  trackId: "track-005" },
  { id: "dlv-021", type: "demo_video",   label: "Demo Video",          placeholder: "https://youtube.com/watch?v=...",   required: true,  trackId: "track-005" },
];

export function getMockDeliverables(trackId: string): MockDeliverable[] {
  return MOCK_DELIVERABLES.filter((d) => d.trackId === trackId);
}

export const MOCK_SUBMISSIONS: MockSubmission[] = [
  {
    id: "sub-001",
    teamId: "team-001",
    teamName: "Cyber_Knights",
    trackId: "track-001",
    trackName: "AI & Machine Learning",
    roundId: "round-001",
    roundName: "Vòng Sơ Loại",
    submissionUrl: "https://github.com/cyber-knights/seal-2026-ai",
    description: "Hệ thống nhận diện gian lận thi cử dùng computer vision",
    isActive: true,
    isEliminated: false,
    createdTime: "2026-08-12T14:30:00Z",
  },
];

export function getMockRounds(eventId?: string): MockRound[] {
  if (!eventId) return MOCK_ROUNDS;
  return MOCK_ROUNDS.filter((r) => r.eventId === eventId);
}

export function getMockTracksByRound(roundId: string): MockTrack[] {
  return MOCK_TRACKS.filter((t) => t.roundId === roundId);
}

export function getMockSubmissions(teamId?: string): MockSubmission[] {
  if (!teamId) return MOCK_SUBMISSIONS;
  return MOCK_SUBMISSIONS.filter((s) => s.teamId === teamId);
}

// Dùng để test UI trước khi có API thực. Thay đổi MOCK_SCENARIO để test các state.

export type TeamStatus = "Forming" | "PendingApproval" | "Registered" | "Disqualified";

export interface MockMember {
  userId: string;
  fullName: string;
  email: string;
  roleName: "TeamLeader" | "TeamMember";
  isApproved: boolean; // hồ sơ đã được duyệt chưa
  school: string;
}

export interface MockTeam {
  id: string;
  name: string;
  description: string;
  eventId: string;
  eventName: string;
  status: TeamStatus;
  isActive: boolean;
  createdTime: string;
}

export interface MockInvitation {
  id: string;
  email: string;
  status: "Pending" | "Accepted" | "Declined" | "Expired";
  sentAt: string;
  expiresAt: string;
}

// ─── Scenarios ────────────────────────────────────────────────────────────────
// Đổi giá trị này để test các trạng thái khác nhau:
// "NO_TEAM"         → Chưa có đội, hiện form tạo đội
// "FORMING_FEW"     → Đang forming nhưng < 3 người
// "FORMING_READY"   → Đủ 3-5 người, tất cả approved
// "FORMING_BLOCK"   → Có người chưa approved profile
// "PENDING"         → Đã gửi xác nhận, chờ BTC duyệt
// "REGISTERED"      → Đã được duyệt, đã đăng ký thành công
// "DISQUALIFIED"    → Bị loại
export const MOCK_SCENARIO =
  "FORMING_READY" as
  | "NO_TEAM"
  | "FORMING_FEW"
  | "FORMING_READY"
  | "FORMING_BLOCK"
  | "PENDING"
  | "REGISTERED"
  | "DISQUALIFIED";

// ─── Mock Current User ────────────────────────────────────────────────────────
export const MOCK_CURRENT_USER = {
  userId: "user-001",
  fullName: "Nguyễn Văn Leader",
  email: "leader@fpt.edu.vn",
  roleName: "TeamLeader" as const,
};

// ─── Mock Team Data per scenario ─────────────────────────────────────────────
const MOCK_TEAMS: Record<string, MockTeam | null> = {
  NO_TEAM: null,
  FORMING_FEW: {
    id: "team-001",
    name: "Cyber_Knights",
    description: "Đội thi chuyên về AI và Cloud Computing tại SEAL 2026",
    eventId: "event-seal-2026",
    eventName: "SEAL Hackathon 2026",
    status: "Forming",
    isActive: true,
    createdTime: "2026-08-10T08:00:00Z",
  },
  FORMING_READY: {
    id: "team-001",
    name: "Cyber_Knights",
    description: "Đội thi chuyên về AI và Cloud Computing tại SEAL 2026",
    eventId: "event-seal-2026",
    eventName: "SEAL Hackathon 2026",
    status: "Forming",
    isActive: true,
    createdTime: "2026-08-10T08:00:00Z",
  },
  FORMING_BLOCK: {
    id: "team-001",
    name: "Cyber_Knights",
    description: "Đội thi chuyên về AI và Cloud Computing tại SEAL 2026",
    eventId: "event-seal-2026",
    eventName: "SEAL Hackathon 2026",
    status: "Forming",
    isActive: true,
    createdTime: "2026-08-10T08:00:00Z",
  },
  PENDING: {
    id: "team-001",
    name: "Cyber_Knights",
    description: "Đội thi chuyên về AI và Cloud Computing tại SEAL 2026",
    eventId: "event-seal-2026",
    eventName: "SEAL Hackathon 2026",
    status: "PendingApproval",
    isActive: true,
    createdTime: "2026-08-10T08:00:00Z",
  },
  REGISTERED: {
    id: "team-001",
    name: "Cyber_Knights",
    description: "Đội thi chuyên về AI và Cloud Computing tại SEAL 2026",
    eventId: "event-seal-2026",
    eventName: "SEAL Hackathon 2026",
    status: "Registered",
    isActive: true,
    createdTime: "2026-08-10T08:00:00Z",
  },
  DISQUALIFIED: {
    id: "team-001",
    name: "Cyber_Knights",
    description: "Đội thi chuyên về AI và Cloud Computing tại SEAL 2026",
    eventId: "event-seal-2026",
    eventName: "SEAL Hackathon 2026",
    status: "Disqualified",
    isActive: false,
    createdTime: "2026-08-10T08:00:00Z",
  },
};

const MOCK_MEMBERS: Record<string, MockMember[]> = {
  NO_TEAM: [],
  FORMING_FEW: [
    { userId: "user-001", fullName: "Nguyễn Văn Leader", email: "leader@fpt.edu.vn", roleName: "TeamLeader", isApproved: true, school: "FPT University HN" },
    { userId: "user-002", fullName: "Trần Thị Bích", email: "bich.tt@fpt.edu.vn", roleName: "TeamMember", isApproved: true, school: "FPT University HN" },
  ],
  FORMING_READY: [
    { userId: "user-001", fullName: "Nguyễn Văn Leader", email: "leader@fpt.edu.vn", roleName: "TeamLeader", isApproved: true, school: "FPT University HN" },
    { userId: "user-002", fullName: "Trần Thị Bích", email: "bich.tt@fpt.edu.vn", roleName: "TeamMember", isApproved: true, school: "FPT University HN" },
    { userId: "user-003", fullName: "Lê Minh Khoa", email: "khoa.lm@fpt.edu.vn", roleName: "TeamMember", isApproved: true, school: "FPT University HCM" },
    { userId: "user-004", fullName: "Phạm Quỳnh Anh", email: "anh.pq@gmail.com", roleName: "TeamMember", isApproved: true, school: "ĐH Bách Khoa HN" },
  ],
  FORMING_BLOCK: [
    { userId: "user-001", fullName: "Nguyễn Văn Leader", email: "leader@fpt.edu.vn", roleName: "TeamLeader", isApproved: true, school: "FPT University HN" },
    { userId: "user-002", fullName: "Trần Thị Bích", email: "bich.tt@fpt.edu.vn", roleName: "TeamMember", isApproved: true, school: "FPT University HN" },
    { userId: "user-003", fullName: "Lê Minh Khoa", email: "khoa.lm@fpt.edu.vn", roleName: "TeamMember", isApproved: false, school: "FPT University HCM" },
    { userId: "user-004", fullName: "Phạm Quỳnh Anh", email: "anh.pq@gmail.com", roleName: "TeamMember", isApproved: false, school: "ĐH Bách Khoa HN" },
  ],
  PENDING: [
    { userId: "user-001", fullName: "Nguyễn Văn Leader", email: "leader@fpt.edu.vn", roleName: "TeamLeader", isApproved: true, school: "FPT University HN" },
    { userId: "user-002", fullName: "Trần Thị Bích", email: "bich.tt@fpt.edu.vn", roleName: "TeamMember", isApproved: true, school: "FPT University HN" },
    { userId: "user-003", fullName: "Lê Minh Khoa", email: "khoa.lm@fpt.edu.vn", roleName: "TeamMember", isApproved: true, school: "FPT University HCM" },
    { userId: "user-004", fullName: "Phạm Quỳnh Anh", email: "anh.pq@gmail.com", roleName: "TeamMember", isApproved: true, school: "ĐH Bách Khoa HN" },
  ],
  REGISTERED: [
    { userId: "user-001", fullName: "Nguyễn Văn Leader", email: "leader@fpt.edu.vn", roleName: "TeamLeader", isApproved: true, school: "FPT University HN" },
    { userId: "user-002", fullName: "Trần Thị Bích", email: "bich.tt@fpt.edu.vn", roleName: "TeamMember", isApproved: true, school: "FPT University HN" },
    { userId: "user-003", fullName: "Lê Minh Khoa", email: "khoa.lm@fpt.edu.vn", roleName: "TeamMember", isApproved: true, school: "FPT University HCM" },
    { userId: "user-004", fullName: "Phạm Quỳnh Anh", email: "anh.pq@gmail.com", roleName: "TeamMember", isApproved: true, school: "ĐH Bách Khoa HN" },
  ],
  DISQUALIFIED: [
    { userId: "user-001", fullName: "Nguyễn Văn Leader", email: "leader@fpt.edu.vn", roleName: "TeamLeader", isApproved: true, school: "FPT University HN" },
    { userId: "user-002", fullName: "Trần Thị Bích", email: "bich.tt@fpt.edu.vn", roleName: "TeamMember", isApproved: true, school: "FPT University HN" },
    { userId: "user-003", fullName: "Lê Minh Khoa", email: "khoa.lm@fpt.edu.vn", roleName: "TeamMember", isApproved: true, school: "FPT University HCM" },
  ],
};

const MOCK_INVITATIONS: MockInvitation[] = [
  { id: "inv-001", email: "newmember1@gmail.com", status: "Pending", sentAt: "2026-08-12T10:00:00Z", expiresAt: "2026-08-13T10:00:00Z" },
  { id: "inv-002", email: "newmember2@fpt.edu.vn", status: "Accepted", sentAt: "2026-08-11T09:00:00Z", expiresAt: "2026-08-12T09:00:00Z" },
  { id: "inv-003", email: "declined@gmail.com", status: "Declined", sentAt: "2026-08-10T08:00:00Z", expiresAt: "2026-08-11T08:00:00Z" },
];

// ─── Exported helpers ─────────────────────────────────────────────────────────
export function getMockTeam(): MockTeam | null {
  return MOCK_TEAMS[MOCK_SCENARIO] ?? null;
}

export function getMockMembers(): MockMember[] {
  return MOCK_MEMBERS[MOCK_SCENARIO] ?? [];
}

export function getMockInvitations(): MockInvitation[] {
  return MOCK_INVITATIONS;
}
