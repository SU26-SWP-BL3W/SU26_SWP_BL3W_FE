# Mô tả màn hình — Role Event Coordinator (EC)

Repo: `SU26_SWP_BL3W_FE` — cập nhật sau khi tách `CoordinatorWorkspaceView.tsx` thành các route riêng (commit `625925f`, nhánh `fix/coordinator-permission-logic`).

Tất cả route dưới `/coordinator/*` đều bọc `RoleGuard allowedRoles={["Coordinator", "Admin"]}` — chỉ 2 role này vào được, người khác bị chặn ở tầng route.

---

## 1. Bảng Điều Hành — `/coordinator/dashboard`

**Component:** `CoordinatorDashboardView.tsx`

Trang mặc định khi EC đăng nhập (`defaultRedirect` trong preset demo). Bố cục:
- Header + nút "Cấu hình vòng thi & nhân sự" → sang wizard tạo sự kiện.
- 4 thẻ chỉ số nhanh: số sự kiện đang phụ trách, tổng số vòng thi, hội đồng giám khảo/cố vấn, tổng đội thi đã đăng ký.
- Bảng danh sách toàn bộ sự kiện EC quản lý (mã, mùa giải, số vòng, hạng mục, thời gian, nút "Quản Lý").

**Trạng thái dữ liệu:** 100% mock (`MOCK_EVENTS` từ `viewModels/mockEventsData.ts`). Chưa nối `eventsRepository` thật — đây là việc cần làm tiếp nếu muốn trang này phản ánh đúng sự kiện thật của EC đang đăng nhập.

---

## 2. Tạo Sự Kiện Mới — `/coordinator/events/new`

**Component:** `CreateEventWizardView.tsx` + `useCreateEventWizardViewModel.ts`

Wizard 5 bước, thanh chỉ báo bước ở đầu trang cho phép nhảy bước tự do:

| Bước | Nội dung | Trạng thái API |
|---|---|---|
| 1. Tạo Event | Tên, mô tả, ngày bắt đầu/kết thúc, hạn đăng ký | **Thật** — `eventsRepository.createEvent` |
| 2. Vòng Thi (Rounds) | Cấu hình các vòng (Sơ loại/Bán kết/Chung kết...) | **Chỉ local state** — không gọi API nào, mất khi refresh |
| 3. Hạng Mục (Tracks) | Cấu hình Track theo từng Round | **Chỉ local state** — không gọi API nào |
| 4. Tiêu Chí (Criteria) | Gán trọng số tiêu chí chấm, bắt buộc tổng = 100% | **Chỉ local state** — không gọi API nào |
| 5. Nhân Sự (Staffing) | Mời Giám khảo/Cố vấn theo email + track | **Thật** — `staffRepository.inviteJudge` / `inviteMentor` |

**Điểm cần lưu ý:** Round/Track/Criteria người dùng nhập ở bước 2–4 hiện KHÔNG được lưu xuống BE (không có lời gọi `roundsRepository`/`tracksRepository`/`templatesRepository` nào trong viewModel) — chỉ Event (bước 1) và lời mời nhân sự (bước 5) là thật. Nếu demo full luồng tạo sự kiện, cần bổ sung các lời gọi API còn thiếu ở bước 2–4.

---

## 3. Duyệt Đội Thi — `/coordinator/teams`

**Component:** `CoordinatorTeamsView.tsx`

Danh sách đội thi đang chờ duyệt đăng ký (`PENDING`), mỗi thẻ hiển thị sĩ số + trạng thái duyệt hồ sơ từng thành viên (badge OK/CHƯA DUYỆT), nút xem chi tiết (modal roster đầy đủ), nút DUYỆT ĐỘI / TỪ CHỐI (kèm modal nhập lý do từ chối).

**Trạng thái dữ liệu:** Thật — `teamsRepository.useGetPendingTeams / useApproveTeamRegistration / useRejectTeamRegistration`.

---

## 4. Duyệt Hồ Sơ Sinh Viên — `/coordinator/profiles`

**Component:** `CoordinatorProfilesView.tsx`

Danh sách user chưa được duyệt hồ sơ (`isApproved: false`), lọc bỏ user đã bị từ chối/tài khoản tạm, có modal xem chi tiết + duyệt/từ chối từng người.

**Trạng thái dữ liệu:** Thật — `usersRepository.useGetUsers / useApproveUser / useRejectUser`.

---

## 5. Phân Công Nhân Sự — `/coordinator/staff` *(view mới, vừa tách ra)*

**Component:** `CoordinatorStaffView.tsx`

2 form song song "Mời Giám Khảo" và "Mời Cố Vấn": nhập email + Track ID (tùy chọn, để trống = áp dụng toàn sự kiện), gửi lời mời qua email.

**Trạng thái dữ liệu:** Thật — `staffRepository.inviteJudge / inviteMentor` (cùng hàm BE mà bước 5 của wizard tạo sự kiện dùng).

Trước đây phần này chỉ là 1 tab trong `CoordinatorWorkspaceView` với `alert()` giả, không gọi API nào — nay đã tách thành trang riêng và nối API thật.

---

## 6. Kho Tiêu Chí RBL & Hiệu Chuẩn Điểm — `/coordinator/calibration`

**Component:** `CoordinatorCalibrationView.tsx`

2 tab:
- **"Kho Tiêu Chí" (mặc định):** danh sách tiêu chí chấm điểm (tên, điểm tối đa, trọng số %, mô tả), form thêm tiêu chí mới.
- **"Hiệu Chuẩn Điểm" (Calibration):** ma trận điểm giám khảo theo Track, nút "Tính điểm & Xếp hạng Vòng thi", nút xuất CSV ẩn danh phục vụ nghiên cứu.

**Trạng thái dữ liệu:** Hỗn hợp — tab Calibration THẬT (`scoresRepository.useGetTrackCalibration / useCalculateRoundResults / useExportCsvAnonymized`); tab Kho Tiêu Chí chỉ local state (`useState` danh sách tiêu chí cứng, thêm mới không lưu BE).

---

## 7. Quản Lý Kết Quả & Công Bố Giải Thưởng — `/coordinator/publish-results`

**Component:** `CoordinatorPublishResultsView.tsx`

Xem kết quả cuối theo Round, tạo giải thưởng theo Track (tên giải, giá trị, số lượng, mô tả), gán giải cho đội đạt hạng, công bố kết quả vòng thi.

**Trạng thái dữ liệu:** Thật — `finalResultsRepository.useGetFinalResultsByRound / usePublishRoundResults / useAssignPrize / useGetPrizes / useCreatePrize`.

Route `/coordinator/results` (cũ) nay **redirect thẳng vào đây** — tránh có 2 URL cho cùng 1 chức năng.

---

## 8. Xét Phúc Khảo — chuyển sang trang dùng chung `/appeals`

`CoordinatorWorkspaceView` cũ có 1 tab "appeals" mock riêng cho EC. Thực tế đã có sẵn `AppealsView.tsx` xử lý đủ cả 2 phía (TeamLeader tạo đơn / EC phản hồi) dựa trên `activeRole`, gọi API thật `appealsRepository`. Route `/coordinator/appeals` nay **redirect sang `/appeals`** thay vì duy trì 1 bản mock trùng lặp.

---

## Tổng kết trạng thái API theo màn hình

| Màn hình | Trạng thái |
|---|---|
| Dashboard | Mock (chưa nối `eventsRepository`) |
| Tạo sự kiện — bước 1, 5 | Thật |
| Tạo sự kiện — bước 2, 3, 4 | Chỉ local state, chưa lưu BE |
| Duyệt đội thi | Thật |
| Duyệt hồ sơ sinh viên | Thật |
| Phân công nhân sự | Thật |
| Kho tiêu chí | Local state, chưa lưu BE |
| Hiệu chuẩn điểm | Thật |
| Công bố kết quả & giải thưởng | Thật |
| Phúc khảo (dùng chung) | Thật |

**Việc lớn nhất còn lại nếu muốn EC "full thật":** nối Dashboard vào `eventsRepository` thật, và bổ sung lời gọi API còn thiếu cho Round/Track/Criteria ở bước 2–4 của wizard tạo sự kiện.
