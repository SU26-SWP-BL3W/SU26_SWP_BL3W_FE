# Kịch bản build lại Bảng Điều Hành Event Coordinator (`/coordinator/dashboard`) — bản cập nhật sau khi verify sống

File: `src/views/CoordinatorDashboardView.tsx` (168 dòng) — trang **đầu tiên** EC nhìn thấy sau khi đăng nhập.

**Khác với bản trước:** bản này đã chạy sống trên server thật (port 3000, đăng nhập role EC thật, đọc network/DOM thật) để xác nhận từng điểm — không còn là suy đoán từ đọc code.

---

## 1. Xác nhận sống — 2 lỗi thật, không phải gu thẩm mỹ

| # | Đã verify sống thế nào | Kết luận |
|---|---|---|
| 1 | Gọi `useEvents()` thật — hiện tại backend chỉ có **1 sự kiện thật** ("SEAL Innovation Challenge 2024"). Lúc query đang settle, giao diện có lúc thoáng qua fallback `MOCK_EVENTS` (5 sự kiện giả) trước khi API trả về đúng 1 sự kiện thật | Xác nhận đúng: cơ chế fallback gây ra khoảng thời gian hiển thị dữ liệu giả xen giữa lúc loading — cần bỏ, không chỉ xử lý ở case "API trả rỗng" |
| 2 | Badge trạng thái sự kiện: quan sát lúc hiển thị `MOCK_EVENTS`, **cả 5 sự kiện đều hiện "ĐANG MỞ"** — kể cả 2 sự kiện có mô tả rành rành *"Vòng chung kết đã trao giải"* / *"Sự kiện chuyên đề đã kết thúc"* | **Nặng hơn dự đoán ban đầu** — đây không phải lỗi tô màu sai, mà là **dòng chữ trạng thái nói sai sự thật**. Nguyên nhân: `ev.status \|\| "ĐANG MỞ"` — trường `status` không tồn tại trên `Event` (API thật) lẫn `MockEvent`, nên MỌI sự kiện luôn rơi vào nhánh fallback "ĐANG MỞ" |
| 3 | 2 số "18" (giám khảo/cố vấn) và "42" (đội thi) — kiểm tra lại: vẫn y nguyên hardcode dù eventsList đã đổi từ mock sang API thật | Xác nhận đúng như bản trước |

## 2. Phát hiện thêm khi tìm hướng sửa — đã có sẵn cơ chế đúng, chỉ cần TÁI SỬ DỤNG

Khi tìm cách tính trạng thái sự kiện đúng, phát hiện `src/viewModels/mockEventsData.ts` **đã có sẵn** đúng cơ chế cần dùng, đang được `LandingPortalView` dùng tốt:

```ts
computeEventStatus(ev, now)  // tính "ongoing" | "registration_open" | "upcoming" | "ended" từ startDate/endDate/registrationEndDate
STATUS_LABEL   // nhãn tiếng Việt tương ứng
STATUS_TONE    // màu Badge tương ứng (success/judge/team/neutral)
```

Đây đúng tinh thần "1 khái niệm, 1 nguồn, dùng lại khắp nơi" (`FE_Design_Spec.md` §20.8) mà `CoordinatorDashboardView` đang VI PHẠM — tự chế ra 1 fallback string cứng thay vì tái dùng hàm đã có. **Không cần nghĩ thuật toán mới — chỉ cần import và dùng lại.**

## 3. Việc sẽ vá ngay (Bước 1)

1. Bỏ `|| MOCK_EVENTS` khi API trả mảng rỗng thật — chỉ giữ `MOCK_EVENTS` làm fallback lúc `isLoading` hoặc lỗi request, không dùng để "độn" khi API trả về hợp lệ nhưng rỗng. Khi rỗng thật → hiện empty-state "Bạn chưa quản lý sự kiện nào — Tạo sự kiện đầu tiên".
2. Thay `<Badge tone="success">{ev.status || "ĐANG MỞ"}</Badge>` bằng `computeEventStatus` + `STATUS_LABEL`/`STATUS_TONE` — badge giờ phản ánh đúng ngày tháng thật của sự kiện.
3. Xoá 2 số hardcode "18"/"42" — vì hiện chưa có repository nào đếm giám khảo/cố vấn/đội thi theo EC, bỏ hẳn 2 thẻ đó khỏi hàng metric thay vì tiếp tục hiện số giả (còn lại 2 thẻ thật: số sự kiện, tổng vòng thi).
4. Đồng bộ 2 thẻ còn lại về `hud-glow-coordinator` (tím) thay vì mượn `hud-glow-cyan` — theo đúng phát hiện màu mượn-vai-trò-khác ở bản trước.

## 4. Vẫn giữ nguyên, chưa làm trong đợt vá này

- Focal panel bất đối xứng đầu trang (mục 4 bản cũ) — cải tiến bố cục, không phải lỗi đúng-sai, để đợt sau.
- Hexagon Loader thay `"..."` — tinh chỉnh nhỏ, để đợt sau.
- Border-top theo trạng thái cho card sự kiện — có thể làm luôn trong đợt này vì dùng chung data `computeEventStatus` vừa thêm, tiện thể làm nốt.
