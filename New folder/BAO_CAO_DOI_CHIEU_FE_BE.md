# Báo cáo đối chiếu FE ↔ BE — SEAL BL3W

**Phạm vi:** BE = `origin/dev` (SU26_SWP_BL3W, 22 controller / 139 endpoint). FE = `main` (SU26_SWP_BL3W_FE, đang trỏ thẳng vào host thật `https://seal-bl3w-backend.onrender.com/api`).
**Phương pháp:** đọc trực tiếp toàn bộ Controllers (BE) và toàn bộ 15 file `repositories/` + tra ngược từng view/route xem có thật sự gọi API hay không (FE). Không suy đoán — mọi dòng dưới đây đều bám code thật.

---

## 1. 🔴 Bug ĐANG CHẠY LIVE — cần sửa trước tiên

### 1.1 Bug "double /api" — 1 số tính năng ĐÃ NỐI nhưng luôn 404
`apiClient.ts` đã có `baseURL` kết thúc bằng `/api`, nhưng 4 file repository lại viết thêm `/api/...` vào đầu path, tạo ra URL sai dạng `.../api/api/Rounds`:

| File | Hàm | Path viết sai | Đang được dùng ở đâu |
|---|---|---|---|
| `staffRepository.ts` | `inviteJudge` | `/api/Judges/invite` | **Bước 5 wizard tạo sự kiện** (`/coordinator/events/new`) — mời giám khảo **luôn fail** |
| `staffRepository.ts` | `inviteMentor` | `/api/Mentors/invite` | Cùng wizard — mời mentor **luôn fail** |
| `staffRepository.ts` | `assignRoleDirectly` | `/api/EventRoles/assign` | `AdminCreateEventView`, `AdminDashboardView` — gán role trực tiếp **luôn fail** |
| `roundsRepository.ts` | cả 2 hàm | `/api/Rounds...` | Chưa gọi tới (wizard bước 2 vẫn local-only) nhưng khi nối sẽ fail ngay |
| `tracksRepository.ts` | cả 2 hàm | `/api/Tracks...` | Tương tự — chưa gọi nhưng sẽ fail khi nối |
| `templatesRepository.ts` | 3/4 hàm object-style | `/api/Criterias`, `/api/Templates...` | Chưa gọi tới |

**→ Đây là bug thật, đang ảnh hưởng 1 luồng có vẻ "đã xong" (mời giám khảo/mentor lúc tạo sự kiện) nhưng thực chất luôn lỗi ngoài production.** Sửa: bỏ tiền tố `/api` thừa trong các path trên (giữ nguyên style như phần lớn các file khác, ví dụ `appealsRepository.ts` chỉ viết `/Appeals` không có `/api`).

### 1.2 Path sai khác giữa FE gọi và BE thật (chưa kịp lộ vì đa số chưa nối UI)

| FE gọi | BE thật có | Trạng thái |
|---|---|---|
| `GET /Scores/team/{teamId}/score-breakdown` | `GET /Scores/team/{teamId}/breakdown` | **Đang dùng thật** ở `MentorProgressView` (`/mentor/progress`) — tên khác 1 chữ, chắc chắn 404 |
| `POST /Teams/{teamId}/transfer-leadership` | `POST /Teams/{teamId}/transfer-leader` | Chưa nối UI thật (MyTeamView đang mock) — sẽ fail nếu nối nguyên xi |
| `GET /Users/me` | `GET /Users/profile` | Hook không ai gọi (bị `useAuth.ts` mock đè tên trùng) — dormant bug |
| `GET /Teams/to-me/my-invitation` (raw call trong `TeamInvitationsView`) | Không có route dạng này — BE chỉ có `GET /Teams/{teamId}/my-invitation` (bắt buộc biết trước teamId) | **Đang dùng thật** ở `/my-invitations` — sai hẳn hình dạng route, không phải lỗi gõ nhầm mà là 2 bên thiết kế khác nhau |

---

## 2. FE thiết kế/gọi nhưng BE KHÔNG có endpoint tương ứng

| Tính năng FE | FE gọi | BE có gì tương ứng? |
|---|---|---|
| **Calibration giám khảo** (`CoordinatorCalibrationView`, `/coordinator/calibration`) | `GET /Scores/track/{trackId}/calibration` | **Không có** — không tồn tại route nào chứa "calibration" trong 139 endpoint |
| **Xuất báo cáo CSV ẩn danh** (cùng view) | `GET /Scores/export/{eventId}?anonymize=true` | **Không có** — khớp đúng phát hiện cũ (Luồng 5 audit BE cũ cũng thiếu, BE mới vẫn chưa có) |
| **Danh sách đội đang chờ duyệt** (`CoordinatorTeamsView`, orphaned) | `GET /Teams/pending` | **Không có** — BE chỉ có `GET /Teams` (list chung, không có sẵn filter riêng theo trạng thái Pending qua route riêng) |
| **Huỷ lời mời vào đội** (`teamsRepository.useCancelInvitation`) | `DELETE /Teams/{teamId}/invitations/{invitationId}` | **Không có** — BE chỉ có respond (accept/decline), không có endpoint Leader tự huỷ lời mời đã gửi |

→ 4 mục này cần: hoặc xin BE bổ sung endpoint, hoặc FE bỏ/thiết kế lại tính năng cho khớp API đang có.

---

## 3. BE có nhưng FE CHƯA gắn / CHƯA thiết kế UI (theo từng luồng)

### Luồng 1 — Auth & Hồ sơ
- `POST /Auth/login` — **UI đăng nhập KHÔNG gọi API thật.** `LoginView` chạy hoàn toàn qua `AuthProvider` mock (tài khoản preset cứng trong code + localStorage). Đây là gap lớn nhất của cả hệ thống.
- `POST /Auth/google-login`, `POST /Auth/logout`, `POST /Auth/forgot-password`, `POST /Auth/reset-password`, `PUT /Auth/change-password` — có hook sẵn, chưa có UI nào gọi.
- `PUT /Auth/student-profiles` (update hồ sơ) — có 2 hook trùng nhau (`authRepository` + `usersRepository`), cả 2 đều chưa được gọi.

### Luồng 2 — Sự kiện, Vòng thi, Hạng mục
- **Toàn bộ trang khách xem sự kiện vẫn mock 100%**: `/` (Landing), `/events` (danh sách), `/events/[id]` (chi tiết) — dù BE đã có đủ `GET /Events`, `GET /Events/{id}`, `GET /Events/upcoming`, `GET /Events/my-events`. Đây chính là 3 view mình build trong session này — xác nhận lại: **vẫn đang mock, chưa nối**, đúng như đã ghi chú trong code.
- `PUT /Events/{eventId}` (sửa sự kiện) — chưa có UI.
- Rounds (tạo/sửa/xoá/list) và Tracks (tạo/sửa/xoá/list/gán template) — **hoàn toàn chưa nối**, kể cả 2 bước wizard tương ứng (Bước 2, Bước 3 tạo sự kiện) vẫn là state cục bộ dù đã import sẵn repository.
- Criterias/Templates CRUD — chỉ có `GET /Criterias` (lấy danh sách) được dùng thật (trong màn chấm điểm); tạo/sửa template, thêm/xoá tiêu chí vào template — chưa có UI nào gọi.

### Luồng 3 — Đội thi
- **`MyTeamView` (`/my-team`) mock hoàn toàn** — tạo đội, mời thành viên, xác nhận đăng ký, chuyển leader, rời đội — tất cả chỉ đổi state cục bộ / `alert()` / `confirm()`, không có request nào thật, dù `teamsRepository.ts` đã viết sẵn đủ 11 hàm cho toàn bộ luồng này.
- `CoordinatorTeamsView.tsx` (duyệt/từ chối đăng ký đội) **đã nối API thật đầy đủ nhưng không route nào render nó** — `/coordinator/teams` lại đang trỏ vào `CoordinatorWorkspaceView` (mock). Chỉ cần đổi route là dùng được ngay, không cần code thêm.
- `EventRoles` (mời Judge/Mentor/EC, gán role, list role theo event/user) — gần như toàn bộ chưa có UI, trừ "gán role trực tiếp" (đang bị bug double-`/api` ở mục 1).

### Luồng 4 — Nộp bài & Chấm điểm
- `PUT /SubmitResults/{id}`, `DELETE /SubmitResults/{id}` — `MySubmissionsView` có nút sửa/xoá nhưng chỉ đổi state cục bộ, không gọi API.
- `ScoreDetails` (cả 5 endpoint: tạo/sửa/xoá/lấy theo id/lấy theo score) — **hoàn toàn chưa có UI nào dùng** (màn chấm điểm hiện chỉ gọi `POST /Scores/save`, gộp sẵn ở BE nên có thể đây là chủ đích, nhưng vẫn nên xác nhận lại với BE).
- `GET /Scores/{id}`, `GET /Scores/{id}/detail`, `PUT/DELETE /Scores/{id}`, `GET /Scores/event-role/{eventRoleId}` — chưa dùng.
- **`Storage` (upload/download file) — 0% được dùng ở bất kỳ đâu.** Không có màn nào cho phép tải ảnh thẻ sinh viên, file bài nộp, v.v. dù BE đã có sẵn API.

### Luồng 5 — Kết quả & Giải thưởng
- `POST /FinalResults` (tạo thủ công), `PUT/DELETE /FinalResults/{id}`, `GET /FinalResults/{id}`, `GET /FinalResults/team/{teamId}` — chưa có UI.
- `LeaderboardView` (`/leaderboard`, `/events/[id]/leaderboard`) — **mock hoàn toàn**, dù `leaderboardRepository.ts` đã viết sẵn 3 hook tương ứng — chỉ là chưa import vào view.
- Appeals — **đây là luồng nối đầy đủ nhất**, cả 3 endpoint đều dùng thật ở `/appeals`. (Nhắc lại từ audit trước: BE phía `RespondAppeal`/`GetAppealsByRound`/`GetAssignedAppeals` vẫn còn thiếu kiểm tra quyền sở hữu — vấn đề nằm ở BE, không phải FE.)

### Khác
- `UserRejections`: chỉ `GetByUserId` được dùng; Create/Update/Delete (phía EC xử lý unlock) chưa có UI.
- `Schools`: `Create` (BE có) chưa có UI thêm trường mới.
- `Users`: Create/Update/Delete (Admin quản lý user) chưa có UI.
- `EventCoordinators/invite`: chưa có UI mời EC.

---

## 4. Trang/view "orphaned" (tồn tại trong code, không route nào render)
- `HomeView.tsx` — view duy nhất gọi `healthRepository`, không route nào dùng.
- `CoordinatorDashboardView.tsx` — mock, không route nào dùng (trùng chức năng với `CoordinatorWorkspaceView` đang thật sự được route).
- `CoordinatorTeamsView.tsx` — **đáng tiếc nhất**: nối API thật đầy đủ, chỉ thiếu 1 dòng route để dùng được ngay.

---

## 5. Khuyến nghị thứ tự xử lý

1. **Sửa ngay bug double-`/api`** (mục 1.1) — 1 dòng/file, đang phá tính năng tưởng đã xong (mời giám khảo/mentor lúc tạo sự kiện).
2. **Đổi route `/coordinator/teams` sang `CoordinatorTeamsView`** — có sẵn, chỉ cần trỏ đúng, được ngay 1 luồng duyệt đội thật.
3. **Nối `/events`, `/events/[id]`, `/` (Landing) vào `GET /Events` thật** — BE đã đủ API, đây là màn khách vào đầu tiên, đang mock 100%.
4. **Nối `LoginView` vào `POST /Auth/login` thật** — hiện toàn bộ hệ thống đăng nhập bằng tài khoản giả lập, rủi ro cao nếu quên trước khi demo/nộp bài.
5. Xác nhận với BE: **Calibration** và **Export CSV** có làm không hay bỏ khỏi FE — đây là 2 tính năng FE thiết kế sẵn nhưng BE chưa từng có.
6. Nối `MyTeamView` vào `teamsRepository` thật — khối lượng lớn nhất (11 hàm đã viết sẵn, chưa dùng cái nào).
7. Nối `LeaderboardView` vào `leaderboardRepository` thật (đã viết sẵn 3 hook).
