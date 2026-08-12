// ⚠️ MOCK DATA dùng chung cho trang khám phá sự kiện (danh sách) + trang chi
// tiết 1 sự kiện — chưa nối API thật vì Luồng 2 (Sự kiện & Vòng thi) chưa có
// Controller trên BE mới. Field đặt tên khớp Event entity thật bên BE
// (EventName/Season/Year/StartDate/EndDate/RegistrationEndDate/Description)
// để sau này đổi sang gọi API thật chỉ cần thay nguồn dữ liệu, không đổi shape.

export interface MockRound {
  id: string;
  roundNumber: number;
  roundName: string;
  startDate: string;
  endDate: string;
  // Mô tả ngắn việc diễn ra trong vòng — dùng cho khối "Lịch trình sự kiện" ở
  // trang chi tiết. Vẫn bám đúng khái niệm Round thật (không bịa mốc giờ/hoạt
  // động không có trong domain, khác kiểu agenda giờ-theo-giờ của hackathon
  // on-site 48h).
  description: string;
}

export interface MockEvent {
  id: string;
  eventName: string;
  season: string;
  year: number;
  tagline: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  maxTeams: number;
  teamCount: number;
  tracks: string[];
  rounds: MockRound[];
  // Tổng giá trị giải thưởng (VND) — mock, dùng cho khối "Hạng mục/Sự kiện nổi
  // bật" kiểu Devpost. BE có sẵn entity Prize thật nhưng Luồng 5 (Kết quả &
  // Giải thưởng) chưa nối API cho trang guest, nên tạm mock cùng chỗ với các
  // field Event khác.
  totalPrizeVnd: number;
}

export const MOCK_EVENTS: MockEvent[] = [
  {
    id: "seal-2026-mua-he",
    eventName: "SEAL Hackathon 2026",
    season: "Mùa Hè",
    year: 2026,
    tagline: "Đấu trường công nghệ dành cho sinh viên toàn quốc",
    description:
      "Sự kiện hackathon thường niên lớn nhất của SEAL — sinh viên toàn quốc thi đấu qua 3 vòng, xây dựng sản phẩm thực tế trong 4 hạng mục công nghệ.",
    startDate: "2026-07-15T00:00:00Z",
    endDate: "2026-09-20T23:59:59Z",
    registrationStartDate: "2026-06-01T00:00:00Z",
    registrationEndDate: "2026-07-10T23:59:59Z",
    maxTeams: 120,
    teamCount: 98,
    totalPrizeVnd: 200_000_000,
    tracks: [
      "AI & Machine Learning",
      "Phát triển Web",
      "Bảo mật & An ninh mạng",
      "IoT & Phần cứng thông minh",
    ],
    rounds: [
      {
        id: "r1",
        roundNumber: 1,
        roundName: "Vòng loại",
        startDate: "2026-07-15T00:00:00Z",
        endDate: "2026-08-10T23:59:59Z",
        description: "Đội thi nộp bài theo hạng mục đã chọn. Giám khảo track chấm điểm, chọn đội vào Bán kết.",
      },
      {
        id: "r2",
        roundNumber: 2,
        roundName: "Bán kết",
        startDate: "2026-08-11T00:00:00Z",
        endDate: "2026-09-05T23:59:59Z",
        description: "Các đội hoàn thiện sản phẩm, nộp bản demo. Kết quả công bố trước khi vào Chung kết.",
      },
      {
        id: "r3",
        roundNumber: 3,
        roundName: "Chung kết",
        startDate: "2026-09-15T00:00:00Z",
        endDate: "2026-09-20T23:59:59Z",
        description: "Thuyết trình trực tiếp trước hội đồng giám khảo, công bố và trao giải các hạng mục.",
      },
    ],
  },
  {
    id: "seal-ai-sprint-2026",
    eventName: "SEAL AI Sprint 2026",
    season: "Thu",
    year: 2026,
    tagline: "48 giờ xây dựng ứng dụng AI thực chiến",
    description:
      "Sprint ngắn 48 giờ, tập trung riêng vào AI ứng dụng — phù hợp cho đội mới bắt đầu muốn thử sức trước khi vào mùa giải chính.",
    startDate: "2026-09-10T00:00:00Z",
    endDate: "2026-09-25T23:59:59Z",
    registrationStartDate: "2026-08-01T00:00:00Z",
    registrationEndDate: "2026-09-01T23:59:59Z",
    maxTeams: 60,
    teamCount: 21,
    totalPrizeVnd: 60_000_000,
    tracks: ["AI & Machine Learning"],
    rounds: [
      {
        id: "r1",
        roundNumber: 1,
        roundName: "Vòng duy nhất",
        startDate: "2026-09-10T00:00:00Z",
        endDate: "2026-09-25T23:59:59Z",
        description: "48 giờ xây dựng sản phẩm AI kể từ lúc mở đề, nộp bài và chấm điểm ngay sau khi đóng cổng nộp.",
      },
    ],
  },
  {
    id: "seal-mini-hack-nam-nhat",
    eventName: "SEAL Mini Hack — Sinh viên năm nhất",
    season: "Thu",
    year: 2026,
    tagline: "Sân chơi khởi động dành riêng cho tân sinh viên",
    description:
      "Quy mô nhỏ, đề bài đơn giản hơn — dành cho sinh viên năm nhất làm quen với hackathon lần đầu.",
    startDate: "2026-10-15T00:00:00Z",
    endDate: "2026-10-20T23:59:59Z",
    registrationStartDate: "2026-09-15T00:00:00Z",
    registrationEndDate: "2026-10-05T23:59:59Z",
    maxTeams: 40,
    teamCount: 0,
    totalPrizeVnd: 15_000_000,
    tracks: ["Phát triển Web", "Ý tưởng sản phẩm"],
    rounds: [
      {
        id: "r1",
        roundNumber: 1,
        roundName: "Vòng duy nhất",
        startDate: "2026-10-15T00:00:00Z",
        endDate: "2026-10-20T23:59:59Z",
        description: "5 ngày làm bài tự do, nộp sản phẩm qua hệ thống. Không yêu cầu thuyết trình trực tiếp.",
      },
    ],
  },
  {
    id: "seal-2025-mua-dong",
    eventName: "SEAL Hackathon 2025",
    season: "Mùa Đông",
    year: 2025,
    tagline: "Mùa giải khép lại năm 2025 với hơn 80 đội thi",
    description: "Vòng chung kết đã trao giải, kết quả và bài nộp vẫn có thể xem lại trong mục lưu trữ.",
    startDate: "2025-11-01T00:00:00Z",
    endDate: "2025-12-20T23:59:59Z",
    registrationStartDate: "2025-10-01T00:00:00Z",
    registrationEndDate: "2025-10-25T23:59:59Z",
    maxTeams: 100,
    teamCount: 84,
    totalPrizeVnd: 150_000_000,
    tracks: ["AI & Machine Learning", "Phát triển Web", "Bảo mật & An ninh mạng"],
    rounds: [
      {
        id: "r1",
        roundNumber: 1,
        roundName: "Vòng loại",
        startDate: "2025-11-01T00:00:00Z",
        endDate: "2025-11-25T23:59:59Z",
        description: "Đội thi nộp bài theo hạng mục đã chọn, giám khảo track chấm điểm chọn đội vào Chung kết.",
      },
      {
        id: "r2",
        roundNumber: 2,
        roundName: "Chung kết",
        startDate: "2025-12-10T00:00:00Z",
        endDate: "2025-12-20T23:59:59Z",
        description: "Thuyết trình trực tiếp trước hội đồng giám khảo, công bố và trao giải các hạng mục.",
      },
    ],
  },
  {
    id: "seal-blockchain-2025",
    eventName: "SEAL Blockchain Challenge 2025",
    season: "Xuân",
    year: 2025,
    tagline: "Chuyên đề Blockchain & Web3 đầu tiên của SEAL",
    description: "Sự kiện chuyên đề đã kết thúc — 45 đội tham gia, giải nhất thuộc về nhóm CryptoWave.",
    startDate: "2025-03-01T00:00:00Z",
    endDate: "2025-06-15T23:59:59Z",
    registrationStartDate: "2025-02-01T00:00:00Z",
    registrationEndDate: "2025-02-25T23:59:59Z",
    maxTeams: 50,
    teamCount: 45,
    totalPrizeVnd: 80_000_000,
    tracks: ["Blockchain & Web3"],
    rounds: [
      {
        id: "r1",
        roundNumber: 1,
        roundName: "Vòng duy nhất",
        startDate: "2025-03-01T00:00:00Z",
        endDate: "2025-06-15T23:59:59Z",
        description: "Xây dựng và nộp sản phẩm Blockchain/Web3, chấm điểm và trao giải khi kết thúc.",
      },
    ],
  },
];

// Metadata hiển thị cho từng hạng mục (icon/màu/mô tả ngắn) — dùng ở khối
// "Các hạng mục thi đấu" tại trang chi tiết sự kiện. Tách riêng khỏi
// MockEvent.tracks (vẫn chỉ là string[]) để không phải sửa lại logic lọc/tag
// đang dùng string ở EventsDiscoveryView. Track không có trong danh sách này
// (hạng mục mới thêm sau) vẫn hiển thị được nhờ DEFAULT_TRACK_META.
export type TrackIconKey = "ai" | "web" | "security" | "iot" | "idea" | "blockchain";

export interface TrackMeta {
  icon: TrackIconKey;
  accent: string;
  description: string;
}

export const TRACK_META: Record<string, TrackMeta> = {
  "AI & Machine Learning": {
    icon: "ai",
    accent: "var(--accent-primary)",
    description: "Xây dựng mô hình, ứng dụng AI/ML giải quyết bài toán thực tế — không chỉ gọi API sẵn có.",
  },
  "Phát triển Web": {
    icon: "web",
    accent: "var(--accent-team)",
    description: "Sản phẩm web hoàn chỉnh — từ giao diện, trải nghiệm người dùng đến hạ tầng vận hành.",
  },
  "Bảo mật & An ninh mạng": {
    icon: "security",
    accent: "var(--accent-coordinator)",
    description: "Công cụ hoặc giải pháp phát hiện, phòng chống rủi ro bảo mật trong hệ thống thật.",
  },
  "IoT & Phần cứng thông minh": {
    icon: "iot",
    accent: "var(--accent-mentor)",
    description: "Kết hợp phần cứng và phần mềm — thiết bị, cảm biến, hệ thống điều khiển thông minh.",
  },
  "Ý tưởng sản phẩm": {
    icon: "idea",
    accent: "var(--accent-judge)",
    description: "Đề bài mở — tự do đề xuất và hiện thực hoá ý tưởng sản phẩm công nghệ của riêng đội.",
  },
  "Blockchain & Web3": {
    icon: "blockchain",
    accent: "var(--accent-secondary)",
    description: "Ứng dụng phi tập trung, hợp đồng thông minh, hoặc hạ tầng Web3 giải quyết vấn đề thực tế.",
  },
};

export const DEFAULT_TRACK_META: TrackMeta = {
  icon: "idea",
  accent: "var(--accent-primary)",
  description: "Hạng mục thi đấu công nghệ trong khuôn khổ sự kiện.",
};
