# Audit Wizard Tạo Sự Kiện (EC) — Logic, Hardcode & Trải nghiệm

Phạm vi: `/coordinator/events/new` — 5 bước, dựa trên `useCreateEventWizardViewModel.ts` + `Step1..Step5` components, đối chiếu với code Backend trên `origin/dev`.

Mọi kết luận dưới đây đều đã **đọc code thật cả 2 phía FE/BE**, có dẫn file:dòng. Chưa chạy live nên các lỗi được đánh dấu rõ là "đọc code thấy" — chưa phải "đã tái hiện được trên trình duyệt".

> **Đính chính bản audit trước của tôi:** trong file kịch bản design gửi trước đó tôi ghi "bước 2–4 chỉ local state, không gọi API". Điều đó **nay đã sai** — code hiện tại đã có gọi `roundsRepository.createRound`, `tracksRepository.createTrack`, `templatesRepository.createTemplate`. Ai đó đã sửa trong lúc song song. Bản này thay thế nhận định cũ.

---

## PHẦN A — Lỗi logic (nặng nhất, chưa ai nêu)

### 🔴 A1. Toàn bộ sự kiện được tạo dưới một EventId GIẢ — `"ev-mock-1"`

`useCreateEventWizardViewModel.ts:296` (và 370, 376):

```ts
const eventId = createdEvent?.EventId || "ev-mock-1";
```

Nhưng Backend trả về field tên là **`Id`**, không phải `EventId`:

```csharp
// CreateEventResponseModel.cs
public string Id { get; set; } = string.Empty;   // ← không có EventId
```

→ `createdEvent?.EventId` **luôn luôn `undefined`** → luôn rơi vào chuỗi cứng `"ev-mock-1"`.

**Hệ quả:** Bước 1 tạo Event thật thành công, nhưng toàn bộ Round (bước 2), Track (bước 3), và lời mời nhân sự (bước 5) đều được gắn vào một event id không tồn tại. Sự kiện vừa tạo sẽ **rỗng hoàn toàn** — không vòng thi, không hạng mục, không nhân sự. Đây là lý do rất có thể giải thích tại sao Dashboard hiển thị *"0 Vòng thi | 0 Tracks"* cho sự kiện thật đang có trên hệ thống.

Cách sửa: `createdEvent?.id || createdEvent?.Id || createdEvent?.EventId` — và **bỏ hẳn fallback chuỗi cứng**, thay bằng báo lỗi dừng luồng (im lặng dùng id giả nguy hiểm hơn nhiều so với báo lỗi).

### 🔴 A2. Dropdown "Thuộc Vòng Thi" ở Bước 3 bị bỏ qua hoàn toàn

Giao diện Bước 3 (ảnh 5) cho phép chọn từng Hạng mục thuộc Vòng thi nào. Nhưng khi submit — `useCreateEventWizardViewModel.ts:321-327`:

```ts
const roundId = rounds[0]?.id || "rnd-mock-1";   // ← lấy CỐ ĐỊNH vòng đầu tiên
for (const trk of tracks) {
  await tracksRepository.createTrack({
    roundId,                    // ← dùng chung 1 giá trị cho MỌI track
    trackName: trk.trackName,   //   giá trị trk.roundId người dùng chọn bị vứt bỏ
    ...
  });
}
```

→ Người dùng chọn gì cũng vô nghĩa, **mọi Track đều bị nhét vào Vòng 1**.

### 🔴 A3. Gửi ID tạm của client lên Backend

`rounds[0].id` là id tạm sinh ở FE (`"tmp-r1"`, `tmp-r${Date.now()}`), không phải RoundId thật do BE trả về sau khi tạo. Tương tự:
- Bước 4 gửi `crit.criteriaId` = `crit-${Date.now()}` — id không tồn tại trong bảng Criteria của BE.
- Bước 5 gửi `staff.trackId` = `tmp-t1`.

→ Cả chuỗi wizard đang truyền **ID tạm phía client** cho Backend thay vì dùng ID thật trả về từ mỗi bước. Đây là gốc rễ chung của A1–A3: luồng thiếu bước "nhận lại ID thật rồi map sang bước sau".

### 🟠 A4. Nhảy bước tự do, bỏ qua mọi kiểm tra

`CreateEventWizardView.tsx:59` — thanh chỉ báo bước cho bấm nhảy thẳng:

```ts
onClick={() => wizard.setCurrentStep(step.number)}
```

→ Có thể bấm thẳng vào "Bước 5" mà chưa hề tạo Event, chưa có Round/Track nào. Toàn bộ validate ở `handleNextStep` bị vô hiệu vì người dùng không đi qua nút "Tiếp tục". Trái với chính yêu cầu của `FE_Design_Spec.md` §20.6 (mỗi bước phải được validate xong mới mở bước kế).

---

## PHẦN B — Vấn đề "ấn thêm tiêu chí không được"

Đọc code thì nút **có chạy** — nhưng có 4 lý do khiến người dùng thấy như bị hỏng:

| # | Nguyên nhân | Vị trí |
|---|---|---|
| 1 | **Thêm xong nút "Tiếp Tục" bị khoá ngay.** Tiêu chí mới mặc định `weight: 10`, cộng vào là tổng vượt 100% → nút đổi thành *"Yêu Cầu Đủ 100% Để Tiếp Tục"* và bị `disabled` | `Step4:225`, `viewModel:225` |
| 2 | **Mục mới bị đẩy xuống cuối danh sách dài**, ngoài tầm nhìn. Không cuộn tới, không highlight, không focus vào ô tên → cảm giác "bấm mà không thấy gì xảy ra" | `Step4:153` |
| 3 | **Không chống trùng.** Bấm cùng 1 chip gợi ý nhiều lần là thêm nhiều bản sao cùng `criteriaId` (ảnh cuối cho thấy danh sách lên tới **9 tiêu chí**, "Innovation 30%" và "Code Quality 40%" lặp lại) | `viewModel:218` |
| 4 | **Thanh tiến trình đánh lừa.** `width: Math.min(totalWeight, 100)%` → tổng 225% vẫn vẽ ra thanh đầy 100%. Chỉ đổi màu đỏ, còn độ dài thì "trông như đã đủ" | `Step4:84` |

Thêm rủi ro dữ liệu: gửi trùng `criteriaId` lên cùng một template (`viewModel:348-355`) — BE nhiều khả năng báo lỗi khóa trùng hoặc ghi đè.

**Hướng sửa:** chống trùng khi thêm từ chip (đã có thì tăng highlight thay vì thêm mới) · tự động chia lại trọng số hoặc thêm với `weight: 0` để không phá mốc 100% · cuộn + focus vào mục vừa thêm · thanh tiến trình cho phép tràn quá 100% (hiện phần vượt bằng màu đỏ) thay vì cắt cụt.

---

## PHẦN C — Hardcode 3–5 thành viên: nghiêm trọng hơn bạn nghĩ

Bạn nói đúng, và thực tế còn tệ hơn — **giao diện Admin đang có một ô cài đặt hoàn toàn vô tác dụng**:

| Tầng | Trạng thái | Vị trí |
|---|---|---|
| **BE — nơi thực thi luật** | Hằng số cứng trong code C#, áp chung toàn hệ thống | `ConfirmTeamRegistrationCommandHandler.cs:21-22` → `const int MIN_TEAM_SIZE = 3; MAX_TEAM_SIZE = 5;` |
| **BE — Event entity** | **Không hề có** field `MinTeamSize`/`MaxTeamSize`. Chỉ có `MaxTeams` (số lượng ĐỘI, khác hẳn số THÀNH VIÊN mỗi đội) | `Event.cs` |
| **BE — API tạo Event** | Không nhận 2 field đó | `CreateEventRequestModel.cs` |
| **FE — Admin** | ⚠️ **Có 2 ô nhập cho người dùng chỉnh `minTeamSize`/`maxTeamSize`**, gửi lên `POST /api/Events` — và **BE lặng lẽ bỏ qua** | `AdminCreateEventView.tsx:25-26, 236-252` |
| **FE — Wizard EC** | Không có field nào cả | `useCreateEventWizardViewModel.ts` |
| **FE — Trang công khai** | Ghi cứng "từ 3 đến 5 thành viên" trong FAQ và badge "3 - 5 THÀNH VIÊN" | `LandingPortalView.tsx:485`, `LandingWorkflowSteps.tsx:16` |

**Vấn đề lớn nhất không phải là "hardcode", mà là "cài đặt ma":** Admin chỉnh min/max thành 4–6, bấm lưu, hệ thống báo thành công — nhưng BE vẫn chặn theo 3–5. Người dùng tin là đã đổi được. Loại lỗi này nguy hiểm hơn hardcode thẳng thắn, vì nó **nói dối người dùng**.

**Hai hướng xử lý, phải chọn 1 và làm nhất quán cả 3 tầng:**

- **(a) Chấp nhận 3–5 là luật cứng toàn hệ thống** (đơn giản, hợp phạm vi đồ án): **gỡ bỏ 2 ô nhập ở màn Admin**, thay bằng dòng chữ tĩnh "Quy định: mỗi đội 3–5 thành viên". Đưa 2 con số về 1 hằng số dùng chung phía FE để FAQ/badge/thông báo lỗi không còn ghi rời rạc mỗi nơi một chỗ.
- **(b) Cho cấu hình theo từng sự kiện** (đúng nghiệp vụ hơn, tốn công hơn): BE thêm `MinTeamSize`/`MaxTeamSize` vào `Event` + migration, `ConfirmTeamRegistration` đọc từ Event thay vì hằng số, FE bổ sung field vào **cả** Admin lẫn Wizard EC, và text công khai đọc theo dữ liệu thật.

---

## PHẦN D — Vì sao nhìn vào bị "ngợp" và khó dùng

Đây là phần bạn cảm nhận đúng nhất — và nguyên nhân rất cụ thể, không mơ hồ:

### 🔴 D1. Giao diện đang nói chuyện bằng ngôn ngữ lập trình viên

Ngay dưới tiêu đề mỗi bước là dòng chữ dành cho dev, hiển thị thẳng cho người dùng cuối:

> *"Actor: Event Coordinator (POST /api/Tracks). Gán từng Hạng mục (Track) thuộc Vòng thi tương ứng…"*
> *"Actor: Event Coordinator (POST /api/Templates, PATCH /api/Tracks/assign-template)…"*
> *"Actor: Event Coordinator (POST /api/Judges/invite, POST /api/Mentors/invite)…"*

Người điều phối sự kiện **không cần biết** endpoint nào được gọi. Đây là ghi chú kỹ thuật bị bỏ quên trong giao diện production.

### 🔴 D2. Mỗi nhãn mang HAI cái tên — nhân đôi tải nhận thức

Đếm trên các ảnh chụp:

- `TỪ NGÀY (STARTDATE)` · `ĐẾN NGÀY (ENDDATE)`
- `TÊN HẠNG MỤC (TRACKNAME)` · `MẪU TIÊU CHÍ (TEMPLATE)`
- `TRỌNG SỐ (WEIGHT %)` · `ĐIỂM TỐI ĐA (MAXSCORE)`
- `QUY TẮC THĂNG HẠNG (ADVANCEMENTRULE - VÍ DỤ: "TOP 10", "PERCENT 50%", "MINSCORE 7.0")`

Nhãn cuối dài **hơn 80 ký tự**, viết hoa toàn bộ, cho một ô nhập duy nhất. Tên cột trong cơ sở dữ liệu đang bị dán vào nhãn người dùng — đúng lỗi mà `FE_Design_Spec.md` §20.8 và nguyên tắc viết copy cảnh báo: *gọi tên sự vật theo cách người dùng nhận ra, không theo cách hệ thống lưu trữ*.

### 🟠 D3. Viết hoa toàn bộ + monospace ở mọi nơi → không còn thứ bậc

Gần như 100% nhãn đều IN HOA và dùng font mono. Khi mọi thứ cùng hét lên như nhau thì **không còn gì nổi bật** — mắt không biết đọc từ đâu. Chữ in hoa cũng mất "hình dáng từ", đọc chậm hơn chữ thường rõ rệt ở cỡ nhỏ.

Font mono vốn dành cho **dữ liệu** (số điểm, ID, ngày giờ) — đang bị dùng cho cả câu văn mô tả dài, khiến đoạn văn khó đọc.

### 🟠 D4. Hộp lồng hộp — 5 tầng viền

Ảnh 5 đếm được: sidebar có viền → panel chính có viền → thẻ bước có viền → thẻ Track có viền → nhóm field có viền. Năm lớp khung lồng nhau mà độ tương phản gần như nhau → mắt không phân biệt được cấp độ nào quan trọng hơn, tất cả nhoè thành một mảng dày đặc.

### 🟠 D5. Bước 4 không thể dùng nổi khi nhiều tiêu chí

Mỗi tiêu chí là một thẻ lớn chứa 4 ô nhập. Với 9 tiêu chí (đúng tình huống trong ảnh) = **36 ô nhập xếp dọc**, phải cuộn rất dài, không có chế độ bảng gọn, không thu gọn được, không thấy tổng quan.

### 🟡 D6. Ba hệ điều hướng cạnh tranh trên cùng màn hình

Cùng lúc có: sidebar trái (5 mục) + breadcrumb trên cùng + thanh 5 bước ngang + thanh đổi vai trò dưới sidebar. Người dùng phải quét 4 vùng khác nhau mới biết mình đang ở đâu.

### Hướng gỡ "ngợp" — ưu tiên theo hiệu quả/công sức

| Ưu tiên | Việc | Công sức | Hiệu quả |
|---|---|---|---|
| 1 | **Xoá toàn bộ dòng "Actor: … (POST /api/…)"** khỏi giao diện | Rất thấp | **Rất cao** |
| 2 | **Bỏ tên cột DB trong ngoặc** ở mọi nhãn (`(STARTDATE)`, `(TRACKNAME)`, `(WEIGHT %)`…). Ví dụ cụ thể đang quá dài → tách xuống dòng gợi ý mờ bên dưới ô nhập | Thấp | **Rất cao** |
| 3 | **Bỏ IN HOA cho nhãn field**, chỉ giữ IN HOA cho tiêu đề mục. Chuyển câu văn mô tả sang font `Sora` thay vì mono | Thấp | Cao |
| 4 | Bỏ bớt 1–2 tầng viền: thẻ con bên trong dùng nền khác màu thay vì thêm viền | Trung bình | Cao |
| 5 | Bước 4 thêm chế độ xem dạng **bảng gọn** (1 dòng/tiêu chí) cho trường hợp nhiều tiêu chí | Trung bình | Cao |
| 6 | Thu gọn/ẩn thanh đổi vai trò (công cụ demo) khỏi khung chính | Thấp | Trung bình |

---

## Thứ tự đề xuất xử lý tổng thể

1. **A1** — EventId giả. Đây là lỗi phá hỏng dữ liệu, mọi thứ khác vô nghĩa nếu sự kiện tạo ra vẫn rỗng.
2. **A2 + A3** — dùng ID thật, tôn trọng lựa chọn Vòng thi của người dùng.
3. **D1 + D2 + D3** — ba việc chỉ *bớt chữ đi*, gần như không rủi ro, nhưng giải quyết phần lớn cảm giác ngợp.
4. **B** — chống trùng + không phá mốc 100% khi thêm tiêu chí.
5. **C** — chốt hướng (a) hay (b) cho luật 3–5, rồi làm nhất quán cả 3 tầng.
6. **A4** — khoá nhảy bước khi bước trước chưa hợp lệ.

---

Chưa sửa gì trong đợt này vì bạn đang cho agent khác chạy — tôi chỉ đọc, không chạm vào file nào. Cho tôi biết muốn bắt đầu từ mục nào.
