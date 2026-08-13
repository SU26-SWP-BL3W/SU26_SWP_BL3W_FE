# Kịch bản thiết kế trang theo Actor — nguyên tắc "1 chức năng = 1 trang riêng"

Đúng, đó là nguyên tắc đang áp dụng: **mỗi chức năng của mỗi actor có 1 route + 1 view riêng, không dùng chung 1 view cho nhiều URL khác nhau.** Đây chính xác là lỗi vừa sửa 2 lần trong session này — `CoordinatorWorkspaceView.tsx` (1 file phục vụ 5 route) và `MentorWorkspaceView.tsx` (1 file phục vụ 3 route) — cả 2 đều bị tách lại đúng theo nguyên tắc này.

File này liệt kê **toàn bộ trang theo từng Actor**, đối chiếu với `FE_Design_Spec.md` §7 (sitemap chuẩn) và trạng thái THẬT hiện tại của code (không phải chỉ trên giấy).

Ký hiệu trạng thái: 🟢 Thật (đã nối API) · 🟡 Hỗn hợp (1 phần thật 1 phần mock) · 🔴 Mock hoàn toàn · ⚪ Chưa tồn tại (có trong spec chuẩn nhưng chưa build)

---

## 0. Khách / Chưa đăng nhập (Guest)

| Route | Chức năng | View | Trạng thái |
|---|---|---|---|
| `/` | Trang chủ, giới thiệu, CTA khám phá/đăng ký | `LandingPortalView` | 🟢 (spotlight sự kiện nối API thật) |
| `/login` | Đăng nhập (email/password + preset demo) | `LoginView` | 🟢 |
| `/register` | Đăng ký tài khoản | `RegisterView` | 🟢 |
| `/verify-email` | Xác thực email qua link | `VerifyEmailView` | 🟢 |
| `/events` | Danh sách sự kiện công khai | `EventsDiscoveryView` | 🔴 (mock, theo báo cáo `BAO_CAO_DOI_CHIEU_FE_BE.md` trước đây — cần re-check nếu đã đổi) |
| `/events/:id` | Chi tiết sự kiện | `EventDetailView` | 🟡 |
| `/leaderboard`, `/events/:id/leaderboard` | Bảng xếp hạng | `LeaderboardView` | 🟡 |

---

## 1. Sinh viên / Đội thi (Team Leader & Team Member)

| Route | Chức năng | View | Trạng thái | Ghi chú |
|---|---|---|---|---|
| `/onboarding/profile` | Xác thực hồ sơ sinh viên (FPT auto / non-FPT upload thẻ) | `OnboardingProfileView` | 🟡 | |
| `/my-team` | Không gian đội thi — tạo/roster/trạng thái, tự thích nghi theo Leader/Member/chưa có đội | `MyTeamView` | 🟡 | Vừa thêm RoleGuard (trước đó thiếu hoàn toàn) |
| `/my-invitations` | Lời mời gia nhập đội + lời mời vai trò sự kiện | `TeamInvitationsView` | 🟢 | |
| `/my-submissions` | Danh sách bài nộp theo vòng/hạng mục | `MySubmissionsView` | 🟡 | Vừa thêm RoleGuard |
| `/submissions/new` | Form nộp bài | `NewSubmissionView` | 🟡 | Vừa thêm RoleGuard |
| `/appeals` | Gửi đơn phúc khảo (Leader) — **dùng chung với EC**, tự phân nhánh qua `activeRole` | `AppealsView` | 🟢 | |
| ⚪ `/my-team/transfer-leader` | Luồng chuyển giao đội trưởng riêng | — | Chưa tách trang riêng — hiện nằm trong `MyTeamView` như 1 hành động, không phải route riêng. Theo đúng nguyên tắc "1 chức năng 1 trang" thì đây LÀ 1 gap, nhưng vì đây là hành động ngắn/hiếm dùng, gộp vào modal trong `MyTeamView` vẫn hợp lý hơn tách route — **đề xuất giữ nguyên, không tách** |
| ⚪ `/rejection-history` | Lịch sử bị từ chối hồ sơ (theo spec §7.3) | — | Chưa build — hiện lý do từ chối hiển thị ở đâu đó trong `MyTeamView`/`OnboardingProfileView`, chưa có trang lịch sử riêng |

---

## 2. Giám khảo (Judge)

| Route | Chức năng | View | Trạng thái | Ghi chú |
|---|---|---|---|---|
| `/judge/scoring` | Bàn chấm điểm — chọn bài nộp, nhập điểm theo tiêu chí, lưu | `JudgeScoringView` | 🟡 | Đây hiện là **route DUY NHẤT** của Judge |

**Gap rõ so với spec chuẩn (§7.4):** spec đề xuất Judge nên có tối thiểu:
- ⚪ `/judge/tracks` — danh sách Hạng mục được phân công (y hệt pattern vừa build cho `MentorTracksView`)
- ⚪ `/judge/tracks/:trackId/teams` — đội thi trong Hạng mục đó
- ⚪ `/judge/leaderboard` — bảng xếp hạng chỉ-đọc cho Track mình phụ trách

Hiện tại `JudgeScoringView` gộp tất cả vào 1 màn hình (chọn bài nộp ngay trong trang chấm điểm) — hoạt động được nhưng không theo đúng nguyên tắc "mỗi chức năng 1 trang" đang áp dụng cho Coordinator/Mentor. **Đây là actor duy nhất còn lại chưa được tách theo nguyên tắc mới** — nên làm nếu muốn nhất quán toàn hệ thống, dùng đúng pattern vừa làm cho Mentor (`useGetTracksByEvent` lọc theo `track.Judges[]` thay vì `track.Mentors[]`).

---

## 3. Cố vấn chuyên môn (Mentor) — vừa tách xong trong session này

| Route | Chức năng | View | Trạng thái |
|---|---|---|---|
| `/mentor/tracks` | Hạng mục được phân công (lọc qua `track.Mentors[]`) | `MentorTracksView` | 🟢 |
| `/mentor/teams` | Đội thi cần hỗ trợ trong Track đã chọn | `MentorTeamsView` | 🟢 |
| `/mentor/submissions` | Tiến độ bài nộp trong Track đã chọn | `MentorSubmissionsView` | 🟢 |
| `/mentor/progress` | Tra cứu điểm 1 đội cụ thể theo TeamId | `MentorProgressView` | 🟢 |

Không còn gap — 4 chức năng, 4 route, không route nào dùng chung view.

---

## 4. Điều Phối Viên Sự Kiện (Event Coordinator / EC) — vừa tách xong trong session này

| Route | Chức năng | View | Trạng thái |
|---|---|---|---|
| `/coordinator/dashboard` | Bảng điều hành, danh sách sự kiện quản lý | `CoordinatorDashboardView` | 🟡 (đang có kịch bản rebuild riêng — xem `KICH_BAN_REBUILD_COORDINATOR_DASHBOARD.md`) |
| `/coordinator/events/new` | Wizard tạo sự kiện (5 bước) | `CreateEventWizardView` | 🟡 (bước 1, 5 thật; bước 2–4 chỉ local state) |
| `/coordinator/teams` | Duyệt đăng ký đội thi | `CoordinatorTeamsView` | 🟢 |
| `/coordinator/profiles` | Duyệt hồ sơ sinh viên | `CoordinatorProfilesView` | 🟢 |
| `/coordinator/staff` | Mời Giám khảo/Cố vấn | `CoordinatorStaffView` | 🟢 |
| `/coordinator/calibration` | Kho tiêu chí + hiệu chuẩn điểm | `CoordinatorCalibrationView` | 🟡 |
| `/coordinator/publish-results` | Công bố kết quả & giải thưởng | `CoordinatorPublishResultsView` | 🟢 |
| `/coordinator/appeals` | Xử lý phúc khảo | → redirect `/appeals` (dùng chung) | 🟢 |
| `/coordinator/results` | (route cũ) | → redirect `/coordinator/publish-results` | — |

Không còn route nào dùng chung view với route khác — đã tách sạch trong 2 đợt sửa vừa qua.

---

## 5. Quản trị viên (Admin)

| Route | Chức năng | View | Trạng thái |
|---|---|---|---|
| `/admin/dashboard` | Bảng điều hành hệ thống, gán EC cho sự kiện | `AdminDashboardView` | 🟡 |
| `/admin/events/new` | Tạo sự kiện (phía Admin) | `AdminCreateEventView` | 🟡 |

**Gap so với spec (§7.7):** spec đề xuất thêm `/admin/users` (quản lý toàn bộ user) và `/admin/schools` (danh mục trường) — hiện chưa có trang nào cho 2 chức năng này, khả năng đang xử lý gộp trong `AdminDashboardView` hoặc chưa build.

---

## 6. Tổng kết theo nguyên tắc "1 chức năng = 1 trang"

| Actor | Đã tuân thủ đúng nguyên tắc? |
|---|---|
| Team Leader/Member | ✅ Đúng (trừ 2 gap nhỏ không bắt buộc tách, xem mục 1) |
| Mentor | ✅ Đúng — vừa tách xong |
| Event Coordinator | ✅ Đúng — vừa tách xong |
| Admin | ✅ Đúng (2 route, 2 view riêng biệt) — nhưng thiếu 2 trang so với spec chuẩn |
| **Judge** | ⚠️ **Chưa** — vẫn gộp mọi chức năng vào 1 màn hình `JudgeScoringView` duy nhất |

**Việc còn lại lớn nhất để toàn hệ thống nhất quán 1 chuẩn:** tách Judge theo đúng pattern Mentor — tạo `JudgeTracksView` (`/judge/tracks`) dùng lại gần như nguyên xi cách làm của `useMyAssignedTracks` (đổi field lọc từ `track.Mentors[]` sang `track.Judges[]`).

---

Xác nhận: bạn muốn tôi thực hiện tách Judge theo đúng pattern này luôn không?
