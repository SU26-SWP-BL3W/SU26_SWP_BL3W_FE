# Kịch bản Design đầy đủ — Dựng trang & Thiết kế lại theo từng Actor

Ký hiệu nguồn thông tin mỗi trang, để bạn biết mức độ tin cậy:
- ✅ **Đã đọc code thật trong session này** — nhận định dựa trên code hiện tại, không đoán.
- 📐 **Theo khung `FE_Design_Spec.md`** — cấu trúc chuẩn, CHƯA đối chiếu với code hiện tại của trang đó. Cần đọc code trước khi build nếu muốn chắc chắn không đụng phải cái đã có.

Toàn bộ token màu/font/component dùng lại nguyên xi hệ thống đã có (`--bg-base`, `--accent-coordinator/judge/mentor/team`, `Chakra Petch`/`Sora`/`JetBrains Mono`, `hud-clipped`, `Button`/`Card`/`Badge` trong `components/ui/`) — không phát minh design system mới.

---

## PHẦN A — Trang đã audit code thật (✅)

### A.1 Landing Page — `/` ✅

**Cấu trúc dựng trang (đã có, giữ nguyên khung):**
1. Hero — SVG Shield giữa, hex-lattice nền, heading 2 dòng, 2 CTA, quick-access strip.
2. Metrics strip.
3. **Spotlight sự kiện mới nhất** — panel bất đối xứng `grid-cols-[1fr_360px]`, đếm ngược, capacity bar, prize box. Đây là mẫu chuẩn tham chiếu cho mọi "focal panel" khác trong hệ thống.
4. Sự kiện nổi bật khác (grid).
5. Workflow steps.
6. Podium Hall of Fame.
7. FAQ.

**Thiết kế lại cụ thể (đã giao trong `KICH_BAN_REBUILD_LANDING_PAGE.md`):**
- Đổi grid 3-cột-đều của section 4 → bố cục lệch (1 lớn + 2 nhỏ), theo đúng tinh thần bất đối xứng của Spotlight.
- FAQ: thêm số thứ tự kiểu terminal `[Q.01]` thay vì `+/−`, cân nhắc bố cục 2 cột.
- Thêm Scanline Reveal khi chuyển route (§18.4 spec) — **1 session khác đang làm việc này song song, đã có `app/[locale]/template.tsx` + `tokens.css` chưa commit, không đụng vào**.

### A.2 Coordinator Dashboard — `/coordinator/dashboard` ✅

**Cấu trúc dựng trang (đã có):**
1. Header — tiêu đề + 2 CTA ("Mời Nhân Sự", "Cấu Hình Vòng Thi").
2. Metrics grid 4 thẻ đều.
3. Grid sự kiện quản lý (3 cột đều).

**Thiết kế lại cụ thể (đã giao trong `KICH_BAN_REBUILD_COORDINATOR_DASHBOARD.md`):**
- **Bắt buộc trước tiên:** bỏ fallback `MOCK_EVENTS` khi API trả rỗng thật (đang gây hiểu lầm dữ liệu), bỏ 2 số hardcode giả (`18`, `42`).
- Đồng bộ toàn bộ 4 thẻ metric về 1 tông `--accent-coordinator` (đang mượn màu Judge/Team sai ngữ nghĩa).
- Thêm 1 khối focal panel đầu trang (tái dùng cấu trúc `LatestEventSpotlight` bên Landing) thay vì để cả trang là các lưới-đều-nhau xếp chồng.
- Loader: đổi `"..."` thành Hexagon Loader cho nhất quán với các trang EC khác.
- Card sự kiện: border-top màu theo trạng thái (giống `PreviewCard` bên Landing).

### A.3 Coordinator — 6 trang còn lại ✅

| Trang | Cấu trúc dựng hiện có | Thiết kế lại cần làm |
|---|---|---|
| `/coordinator/teams` | Header + counter PENDING + list card (roster preview, nút Duyệt/Từ chối, modal chi tiết) | Đã ổn theo chuẩn Command Deck — **không cần sửa**, đây là mẫu tốt |
| `/coordinator/profiles` | Tương tự Teams — list user chờ duyệt, modal chi tiết | Đã ổn — **không cần sửa** |
| `/coordinator/staff` | 2 form song song mời Judge/Mentor, có event-selector | Đã ổn — **không cần sửa** (vừa được 1 session khác nâng cấp UI đẹp hơn bản gốc của tôi) |
| `/coordinator/calibration` | 2 tab: Kho tiêu chí (local state) + Hiệu chuẩn điểm (real API) | Tab "Kho tiêu chí" nên có banner rõ ràng báo "Chưa lưu server" nếu vẫn giữ local-only, tránh EC tưởng đã lưu |
| `/coordinator/publish-results` | Bảng kết quả theo Round + form tạo giải thưởng + modal gán giải | Đã ổn về cấu trúc — cân nhắc thêm dialog xác nhận rõ ràng hơn cho hành động Publish (theo §20.4 spec — publish/unpublish không cần confirm dialog nặng, nhưng nên có toast xác nhận rõ) |
| `/coordinator/events/new` (wizard) | 5 bước, step indicator ngang, có thể nhảy bước tự do | **Bước 2–4 chưa lưu API** — đây là vấn đề chức năng, không phải thẩm mỹ, ưu tiên sửa logic trước khi chỉnh design |

### A.4 Mentor — 4 trang ✅ (vừa build trong session này)

| Trang | Cấu trúc dựng | Trạng thái design |
|---|---|---|
| `/mentor/tracks` | Header + grid card Track (mentor đồng hành, judge phụ trách, 2 nút điều hướng) | Mới build, theo đúng chuẩn — đã ổn |
| `/mentor/teams` | Header + track-selector + grid card đội thi (số bài nộp, lần nộp gần nhất) | Mới build — đã ổn |
| `/mentor/submissions` | Header + track-selector + bảng bài nộp (link, thời gian) | Mới build — đã ổn |
| `/mentor/progress` | Search team + bảng breakdown điểm | Có sẵn trước session này, đã real API — không cần sửa |

Cả 4 trang Mentor dùng chung 1 màu `--accent-mentor` (teal) nhất quán, không mắc lỗi mượn màu như Coordinator Dashboard.

---

## PHẦN B — Trang theo khung spec, CHƯA đối chiếu code hiện tại (📐)

Với các trang này, tôi mô tả **cấu trúc dựng chuẩn theo `FE_Design_Spec.md`** — trước khi build/sửa thật, cần đọc code hiện tại của từng trang để biết đang ở mức nào (mock/thật, đã có gì).

### B.1 Judge — `/judge/scoring` 📐

**Vấn đề đã biết (từ audit trước đây trong session, cần re-verify):** từng ghi nhận là mock, giám khảo không chấm được thật — có thể đã đổi vì nhiều session song song đã sửa nhiều thứ.

**Cấu trúc dựng chuẩn theo spec §4.3 (`Judge's Scoring Deck`):**
1. Palette chuyển hẳn sang Amber (`--accent-judge`), sidebar/lattice nền mờ đi để giảm xao nhãng — **"Pure Evaluation Workspace"**.
2. Danh sách tiêu chí dạng `Numeric Score Evaluator` (§3.2.3) — mỗi tiêu chí 1 hàng: tên, max score, weight%, stepper `-1`/`+1`.
3. Panel tổng điểm live-update, công thức chính xác: `Σ(Value/MaxScore × Weight/100) × 10`, làm tròn 2 số thập phân.
4. Khoá input khi `IsSubmitted = true`, chỉ mở lại khi có Appeal được duyệt (banner vàng cảnh báo).
5. Ẩn tên đội/thành viên — chỉ hiện ID bài nộp ẩn danh (BR-12).
6. Phím tắt: số/mũi tên chỉnh điểm, Enter/Tab chuyển tiêu chí, Ctrl+S lưu, nút "Bài tiếp theo" luôn hiện.

**Khuyến nghị theo nguyên tắc "1 chức năng 1 trang" (đã trao đổi ở kịch bản trước):** tách thành `/judge/tracks` (danh sách Hạng mục được phân công, tái dùng đúng cấu trúc `MentorTracksView` — đổi field lọc sang `track.Judges[]`) + `/judge/tracks/:trackId/teams` (đội thi trong Track) → rồi mới vào `/judge/scoring` để chấm. Việc này **cần bạn xác nhận trước khi làm**, vì đổi luồng điều hướng của Judge là quyết định lớn hơn 1 lần sửa UI đơn thuần.

### B.2 Team Leader/Member — 4 trang 📐

| Trang | Cấu trúc dựng chuẩn theo spec §4.2 |
|---|---|
| `/my-team` | Layout thích nghi theo trạng thái user: Chưa có đội → `[Tạo đội]`/`[Tham gia đội]`; Member → xem roster/bài nộp/rời đội; Leader → quản roster, mời thành viên, nút `[NỘP BÀI]`, chuyển giao đội trưởng. Ràng buộc roster 3–5 thành viên phải chặn ngay trên UI, không chỉ chặn ở BE. Hiện banner `LastRejectReason` nếu đội từng bị từ chối |
| `/my-submissions` | Danh sách bài nộp dạng bảng/card theo vòng+hạng mục, trạng thái (đã nộp/đã chấm/bị loại) |
| `/submissions/new` | Form nộp bài — 1 trường quan trọng nhất là link nộp (repo/demo), validate theo `Track.RoundId` còn mở hay đã khoá |
| `/my-invitations` | Đã có — 2 khối: lời mời đội + lời mời vai trò sự kiện, có lịch sử đã phản hồi |

**Điểm cần lưu ý riêng cho Team Ops Hub:** theo spec §9.1, trạng thái đội đi qua `Forming → PendingApproval → Registered`, KHÔNG nhảy thẳng `Forming → Registered` khi Leader bấm confirm — UI phải có badge "Chờ BTC duyệt" ở bước giữa, tách biệt rõ với "Đã duyệt".

### B.3 Admin — 2 trang hiện có + 2 trang thiếu 📐

| Trang | Trạng thái |
|---|---|
| `/admin/dashboard` | Đã có (`AdminDashboardView`) |
| `/admin/events/new` | Đã có (`AdminCreateEventView`) |
| ⚪ `/admin/users` | Chưa có route riêng — theo spec nên là 1 bảng CRUD toàn bộ user, dùng đúng `Table` component + filter đã dùng ở `CoordinatorProfilesView` |
| ⚪ `/admin/schools` | Chưa có route riêng — danh mục trường, CRUD đơn giản |

### B.4 Trang công khai còn lại 📐

`/events` (danh sách sự kiện), `/events/:id` (chi tiết), `/leaderboard` — theo spec §4.5 (Podium layout, Standard Competition Ranking 1-1-3 cho tie-score, audit trail khi click vào 1 hàng bảng xếp hạng). Cần đọc code hiện tại trước khi kết luận cần sửa gì cụ thể.

---

## Thứ tự đề xuất nếu làm full

1. **Coordinator Dashboard** (Bước 1 trong kịch bản riêng — vá dữ liệu giả trước tiên, đây là lỗi đúng-sai không phải gu thẩm mỹ).
2. **Landing Page** (3 điểm cụ thể đã giao).
3. **Tách Judge** theo nguyên tắc 1-chức-năng-1-trang (cần bạn xác nhận hướng trước).
4. Đọc code + audit cụ thể từng trang ở Phần B trước khi chỉnh, tránh sửa dựa trên giả định spec sai với thực tế code.

---

Bạn muốn tôi bắt đầu thực thi từ đâu — Bước 1 (vá Coordinator Dashboard) hay đọc code Phần B trước để có audit chắc chắn hơn?
