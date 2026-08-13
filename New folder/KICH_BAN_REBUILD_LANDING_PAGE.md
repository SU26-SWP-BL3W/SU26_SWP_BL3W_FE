# Kịch bản build lại Landing Page (`/`)

Repo: `SU26_SWP_BL3W_FE` — file chính: `src/views/LandingPortalView.tsx` (500 dòng, 7 section) + `FE_Design_Spec.md` §4.1, §18 làm chuẩn.

## 1. Hiện trạng — cái gì đã tốt, GIỮ NGUYÊN

Landing page hiện tại không phải làm từ đầu — đã có 7 section theo đúng Command Deck theme (navy nền, cyan accent, `hud-clipped` góc vát, font display/mono/sans phân vai đúng chuẩn):

1. **Hero** — SVG Shield giữa, hex-lattice nền, status tag "SYSTEM OPERATIONAL", heading 2 dòng, CTA + quick-access strip.
2. **Metrics strip** (`LandingMetricsStrip`).
3. **Spotlight sự kiện mới nhất** — panel bất đối xứng `lg:grid-cols-[1fr_360px]`, đếm ngược real-time, thanh capacity, prize box, timeline vòng thi. **Đây là section làm tốt nhất trong toàn trang** — không cần đụng vào, giữ nguyên làm chuẩn tham chiếu cho các section khác.
4. **Sự kiện nổi bật khác** (Preview grid).
5. **Workflow steps** (`LandingWorkflowSteps`).
6. **Podium Hall of Fame** (`LandingLeaderboardPodium`).
7. **FAQ**.

Kết luận: đây là 1 cuộc **nâng cấp có chọn lọc**, không phải viết lại từ số 0 — mất công vô ích nếu build lại toàn bộ trong khi Section 3 đã đạt chất lượng cần có.

## 2. Điểm cụ thể cần sửa (đối chiếu checklist redesign)

| # | Vị trí | Vấn đề | Hướng sửa |
|---|---|---|---|
| 1 | `PreviewSection` (dòng 374–406) — "SỰ KIỆN NỔI BẬT KHÁC" | Grid 3 cột đều nhau (`sm:grid-cols-3`) — đây đúng là pattern "3 card cột bằng nhau" bị liệt vào generic AI layout phổ biến nhất | Đổi sang bố cục lệch: 1 card lớn (sự kiện gần nhất trong nhóm còn lại) + 2 card nhỏ xếp dọc bên cạnh, hoặc masonry theo độ dài tagline. Tham khảo đúng cấu trúc bất đối xứng đã dùng ở Spotlight (`1fr_360px`) để nhất quán ngôn ngữ thị giác toàn trang |
| 2 | `LandingFaqSection` (dòng 438–499) | Accordion dọc đơn thuần — pattern phổ biến, không có gì phân biệt với FAQ mặc định của bất kỳ landing page nào | Giữ accordion (hợp lý cho FAQ) nhưng thêm 1 điểm khác biệt hoá theo đúng chất "Command Deck": số thứ tự dạng `[Q.01]` `[Q.02]` kiểu terminal-log thay vì dấu `+/−` thường, hoặc chuyển bố cục 2 cột (câu hỏi bên trái dạng danh sách chọn, nội dung trả lời hiện bên phải — giống panel context của HUD) |
| 3 | Toàn trang | Chưa có **Scanline Reveal on Route Transition** (đặc tả tại §18.4 của `FE_Design_Spec.md`) — 1 vệt sáng ngang quét 1 lần khi vào trang, đúng signature visual đã định nghĩa nhưng chưa implement ở đâu trong codebase | Thêm 1 lần tại `template.tsx` cấp `app/[locale]/` (theo đúng khuyến nghị của spec — tự động áp dụng mọi route, không phải tự thêm tay từng view) |
| 4 | Hero — Quick Access strip (dòng 93–105) | Link "[ GIÁM KHẢO ]" vừa sửa xong (trỏ đúng `/judge/scoring`) nhưng cả 3 link (Đội thi / Giám khảo / Ban tổ chức) hiện KHÔNG có logic ẩn/hiện theo trạng thái đăng nhập — luôn hiện cho mọi người kể cả khách chưa đăng nhập, dẫn thẳng vào RoleGuard chặn | Cân nhắc: với khách chưa đăng nhập, đổi 3 link này thành 1 CTA duy nhất "Đăng nhập để vào khu vực của bạn", tránh click-rồi-bị-chặn — nhưng đây là quyết định UX cần bạn xác nhận trước khi sửa (không tự ý đổi) |
| 5 | `LatestEventSpotlight` | Không có UI khi `event.rounds` rỗng NHƯNG `countdown.isPast` cũng false — hiếm gặp nhưng là 1 khoảng trống trạng thái chưa xử lý | Ưu tiên thấp, có thể bỏ qua nếu dữ liệu luôn có rounds |

## 3. Kịch bản thực hiện (theo thứ tự, có thể làm từng bước độc lập)

**Bước 1 — Scanline route transition (§18.4)** — effort thấp, tác động toàn site, làm trước vì độc lập với mọi phần khác.
→ Tạo `src/app/[locale]/template.tsx`, 1 lần quét sáng ngang ~250ms khi mount, dùng `transform: scaleY`/`background-position`, có `prefers-reduced-motion` guard theo đúng §19.2.

**Bước 2 — Bố cục lại `PreviewSection`** — effort trung bình, chỉ đụng 1 component (`PreviewSection`/`PreviewCard`, dòng 374–433), không ảnh hưởng phần còn lại của trang.
→ Đổi grid 3-cột-đều thành layout lệch (1 card lớn + 2 card nhỏ), giữ nguyên toàn bộ data-fetching (`useLandingPreviewViewModel`) — chỉ đổi JSX layout.

**Bước 3 — Làm mới FAQ** — effort trung bình.
→ Giữ toggle logic hiện có (`openIdx` state), đổi UI: đánh số `[Q.01]` kiểu terminal thay vì `+/−`, cân nhắc bố cục 2 cột nếu đủ chỗ ở viewport desktop-only (spec §16 xác nhận web chỉ target desktop `1280px+`, nên bố cục 2 cột hoàn toàn khả thi).

**Bước 4 — Quyết định UX cho Quick Access strip** (mục 4 ở bảng trên) — **cần bạn xác nhận hướng trước khi làm**, vì đổi hành vi cho khách chưa đăng nhập là quyết định sản phẩm, không phải lỗi kỹ thuật đơn thuần.

## 4. Việc KHÔNG làm trong đợt này

- Không viết lại Hero, Spotlight, Metrics, Workflow, Podium — các phần này đã đúng chuẩn `FE_Design_Spec.md`, đụng vào là rủi ro không cần thiết.
- Không đổi màu sắc/token — bảng màu hiện tại đã khớp 100% với §2.1 của spec.
- Không thêm thư viện animation ngoài (GSAP/Three.js) — đúng nguyên tắc hiệu năng ở §6/§19 của spec.

---

Xác nhận lại: bạn muốn tôi thực hiện lần lượt Bước 1 → 3 luôn, hay chỉ bước nào trước?
