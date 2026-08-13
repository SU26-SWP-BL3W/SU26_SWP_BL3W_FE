# Phân tích thẩm mỹ & hướng thiết kế — Landing Page SEAL

Phạm vi: phần **hero + thanh điều hướng** nhìn thấy trong ảnh chụp màn hình (viewport ~1900px). Các section phía dưới (metrics, spotlight, workflow, podium, FAQ) đã phân tích ở file kịch bản riêng trước đó.

---

## 1. Điều đang LÀM TỐT — giữ nguyên, đây là vốn liếng của thiết kế

Trước khi nói cái cần sửa, phải ghi nhận rõ những thứ đang đúng, vì đây chính là phần tạo nên cá tính riêng, không nên đụng vào:

- **Bảng màu nền**: navy sâu (`#070b14`) + cyan điện (`#00d9ff`) — đúng chất "Command Deck", không rơi vào bẫy gradient tím-xanh generic.
- **Typography display**: `Chakra Petch` in hoa, chữ lớn, nét vuông góc — mạnh, có bản sắc, hợp chủ đề hackathon/cyber. Dòng "NƠI Ý TƯỞNG CÔNG NGHỆ / BỨT PHÁ GIỚI HẠN" là điểm mạnh nhất của cả trang.
- **Nền hex-lattice mờ**: tinh tế, không lấn nội dung, đúng nguyên tắc "depth bằng border + glow nhẹ, không dùng blur nặng".
- **Góc vát `hud-clipped`**: nhất quán trên nút và panel — thay cho bo tròn `rounded-lg` phổ biến, đây là chi tiết nhận diện tốt.
- **Nút CTA chính** (`// KHÁM PHÁ SỰ KIỆN >`): nền cyan đặc, chữ tối, dạng terminal — nổi bật đúng mức.

Nói ngắn gọn: **hệ thống thiết kế đang đúng, vấn đề nằm ở việc dùng nó quá tay.**

---

## 2. Vấn đề thẩm mỹ — xếp theo mức độ ảnh hưởng

### 🔴 Vấn đề #1: Loạn màu accent — nghiêm trọng nhất

Đếm số màu riêng biệt trong **1 dải navbar cao chưa tới 50px**:

| Phần tử | Màu |
|---|---|
| Logo SEAL | cyan |
| `+ Tạo Sự Kiện` | cyan |
| `Duyệt Thẻ SV` | xanh dương |
| `Kho Tiêu Chí RBL` | vàng hổ phách |
| `Control Center BTC →` | tím |
| Chuông thông báo | trắng + chấm đỏ |
| `Coord` (trong dải Role) | cyan |
| `Đăng xuất` | đỏ |

→ **6+ tông màu khác nhau chen trong một hàng.** Rồi ngay dưới hero lặp lại đúng lỗi đó lần nữa:

`[ ĐỘI THI ]` xanh · `[ GIÁM KHẢO ]` vàng · `[ BAN TỔ CHỨC ]` tím

**Vì sao đây là lỗi chứ không phải sở thích:** theo chính `FE_Design_Spec.md` §2.1, bốn màu vai trò (`--accent-team` / `--accent-judge` / `--accent-mentor` / `--accent-coordinator`) được định nghĩa là **"Functional Wayfinding"** — màu để người dùng biết *mình đang ở khu vực của vai trò nào*. Khi rải cả 4 màu lên trang chủ công khai — nơi người xem chưa có vai trò nào cả — thì màu mất sạch chức năng chỉ đường, chỉ còn là trang trí. Sau này vào đúng khu vực Judge (vàng) hay Coordinator (tím), người dùng không còn cảm nhận được sự chuyển vùng nữa vì đã thấy nhàm cả 4 màu ngay từ trang đầu.

**Hệ quả thị giác trực tiếp:** mắt không biết nhìn đâu trước. Nút CTA chính màu cyan đang phải cạnh tranh với 7-8 thứ có màu khác cũng nổi không kém.

### 🔴 Vấn đề #2: Thanh chuyển vai trò (dev tool) nằm giữa giao diện production

Dải `Role: Admin | Leader | Member | Mentor | Judge | Coord` là công cụ demo/test, nhưng đang đặt ngang hàng với điều hướng thật, dùng cùng font và cùng vùng thị giác. Về mặt thẩm mỹ nó đọc như **debug UI bị bỏ quên** — làm giảm cảm giác "sản phẩm hoàn chỉnh" ngay ở cái nhìn đầu tiên, đúng chỗ dễ gây ấn tượng xấu nhất.

### 🟠 Vấn đề #3: Đối xứng tuyệt đối → thiếu sức căng thị giác

Toàn bộ hero đối xứng hoàn hảo qua trục dọc: logo giữa, tag giữa, tiêu đề giữa, mô tả giữa, nút giữa, quick-access giữa. Không có bất kỳ điểm phá thế nào.

Đối xứng tuyệt đối cho cảm giác **an toàn nhưng tĩnh và dễ đoán** — trong khi chủ đề "hackathon / bứt phá giới hạn" cần cảm giác động. Đáng chú ý là chính trang này đã có sẵn 1 mẫu bố cục lệch rất tốt ở section Spotlight bên dưới (`grid-cols-[1fr_360px]`) — nhưng hero lại không thừa hưởng tinh thần đó.

### 🟠 Vấn đề #4: Ba lớp hexagon chồng nhau ở hero

Đang có đồng thời:
1. Nền lattice hexagon mờ (toàn trang)
2. Vòng hexagon lớn nét đứt (~750px)
3. Khung vuông chứa logo shield — bên trong lại là hexagon nữa

Ba lần lặp cùng một hình khối ở ba tỷ lệ khác nhau, chồng lên nhau → **nhiễu**, và làm logo shield (điểm cần nổi nhất) bị chìm vào nền vì cùng motif, cùng màu cyan, cùng độ mờ tương đối.

### 🟡 Vấn đề #5: Hero chiếm trọn màn hình nhưng ~45% là khoảng trống chết

Nội dung thực tế (logo → quick access) chỉ chiếm phần giữa. Hai bên trái/phải của khối tiêu đề trống hoàn toàn, phía trên logo cũng dư nhiều. Trên màn 1900px, người dùng phải cuộn hết 1 màn hình mới thấy được thông tin thực chất đầu tiên (metrics).

### 🟡 Vấn đề #6: Độ tương phản chữ phụ

Dòng mô tả dưới tiêu đề dùng `--text-muted` (#8a97ac) cỡ nhỏ. Theo §20.1 của spec, cặp màu này đạt 6.65:1 — qua chuẩn AA nhưng **spec ghi rõ "không được để `--text-muted` xuống dưới 12px"**. Cần kiểm lại cỡ chữ thực tế ở đây, và cân nhắc nâng lên `--text-primary` vì đây là câu định vị sản phẩm quan trọng, không phải chú thích phụ.

---

## 3. Hướng thiết kế đề xuất

### 3.1 Nguyên tắc chủ đạo: **"Một trang — một màu điểm nhấn"**

Quy tắc áp dụng cho toàn bộ khu vực công khai (`/`, `/events`, `/login`, `/register`):

> Trang công khai **chỉ dùng cyan** (`--accent-primary`). Bốn màu vai trò được **giữ lại độc quyền** cho khu vực nội bộ tương ứng của từng vai trò.

Cụ thể:
- 4 nút hành động trên navbar → **cùng một kiểu ghost viền xám**, chỉ nút đang active hoặc nút chính mới dùng cyan.
- 3 link quick-access trong hero → bỏ màu vai trò, dùng chung một kiểu chữ mono viền mờ. Màu sắc phân biệt được thay bằng **nhãn chữ** (vốn đã có sẵn: `[ ĐỘI THI ]`, `[ GIÁM KHẢO ]`, `[ BAN TỔ CHỨC ]`) — đúng nguyên tắc §20.2 "không dựa vào màu đơn thuần để truyền tin".
- `Đăng xuất` đỏ → chuyển thành chữ xám, chỉ chuyển đỏ khi hover. Đỏ nên để dành cho lỗi/hành động phá hủy, không phải cho một thao tác thường ngày.

**Kết quả kỳ vọng:** navbar từ 6 màu → 2 màu (xám + cyan). Nút CTA chính lập tức trở thành thứ nổi nhất màn hình mà không cần đổi gì trên chính nó.

### 3.2 Xử lý thanh chuyển vai trò

Ba lựa chọn, xếp theo thứ tự nên ưu tiên:

1. **Tốt nhất**: ẩn sau một nút nhỏ (icon), bấm mới xổ ra — vẫn tiện demo, không chiếm chỗ thị giác.
2. Chấp nhận được: đẩy xuống thành thanh nổi nhỏ ở góc dưới màn hình, nền tối, chữ nhỏ, tách hẳn khỏi chrome chính.
3. Tối thiểu: giữ nguyên vị trí nhưng giảm hẳn độ nổi — chữ xám mờ, bỏ highlight cyan, thêm nhãn `DEV` phía trước để người xem hiểu đây là công cụ thử nghiệm.

### 3.3 Phá thế đối xứng cho hero

Đề xuất bố cục lệch, tận dụng khoảng trống hai bên đang bỏ phí:

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│   ● SYSTEM OPERATIONAL                    ╱╲           │
│                                          ╱  ╲          │
│   NƠI Ý TƯỞNG CÔNG NGHỆ                 │ ◇ │  ← shield │
│   BỨT PHÁ GIỚI HẠN                       ╲  ╱   lớn,   │
│                                           ╲╱    lệch   │
│   Đấu trường hackathon dành cho                 phải,  │
│   sinh viên toàn quốc...                        tràn   │
│                                                 mép    │
│   [ // KHÁM PHÁ SỰ KIỆN > ]  [ ĐĂNG KÝ ]               │
│                                                        │
└────────────────────────────────────────────────────────┘
```

- Chữ dồn về **trái**, căn trái thay vì căn giữa → đọc tự nhiên hơn, tạo được nhịp.
- Shield + vòng hexagon dồn về **phải**, cho phép **tràn ra ngoài mép phải** (cắt bớt) — đây là thủ pháp tạo chiều sâu và cảm giác "còn tiếp diễn" rất hợp chủ đề, đồng thời giải quyết luôn vấn đề khoảng trống chết.
- Bỏ khung vuông bao quanh logo → chỉ còn 1 hexagon lớn duy nhất làm điểm nhấn, gỡ được lỗi chồng 3 lớp motif.

Nếu muốn giữ đối xứng (quyết định hợp lệ nếu ưu tiên cảm giác trang trọng), thì tối thiểu phải: **giảm chiều cao hero xuống ~75vh** và **bỏ khung vuông quanh logo**.

### 3.4 Thiết lập lại thứ bậc CTA

Hiện có 5 điểm bấm được nằm sát nhau ở cuối hero (2 nút lớn + 3 link nhanh), tất cả đều có màu.

Đề xuất:
- **1 hành động chính**: `// KHÁM PHÁ SỰ KIỆN >` — giữ nguyên nền cyan đặc.
- **1 hành động phụ**: `[ ĐĂNG KÝ THAM GIA ]` — ghost, viền mờ, chữ trắng.
- **3 link vai trò**: hạ xuống cấp thấp nhất — chữ mono xám nhỏ, không viền, không màu, hoặc cân nhắc **chỉ hiện khi đã đăng nhập** (vì khách bấm vào sẽ bị `RoleGuard` chặn ngay — hiện tại đang mời người ta bấm vào cánh cửa khoá).

---

## 4. Tóm tắt thứ tự thực hiện

| Ưu tiên | Việc | Công sức | Tác động thị giác |
|---|---|---|---|
| 1 | Gom navbar + quick-access về 1 màu cyan | Thấp | **Rất cao** |
| 2 | Hạ cấp / ẩn thanh Role switcher | Thấp | Cao |
| 3 | Bỏ khung vuông quanh logo shield | Rất thấp | Trung bình |
| 4 | Thiết lập lại thứ bậc 5 nút CTA | Thấp | Cao |
| 5 | Phá thế đối xứng hero (bố cục lệch) | Trung bình | Cao |
| 6 | Giảm chiều cao hero xuống ~75vh | Thấp | Trung bình |
| 7 | Kiểm tra lại cỡ/độ tương phản chữ mô tả | Rất thấp | Thấp |

**Điểm mấu chốt:** ba việc đầu tiên đều là *bớt đi*, không phải *thêm vào* — và chỉ riêng ba việc đó đã giải quyết được phần lớn cảm giác "rối và chưa chỉn chu" hiện tại. Thiết kế này không thiếu ý tưởng, nó đang thừa tín hiệu.
