---
name: plan-first-workflow
description: Quy trình bắt buộc luôn nghiên cứu, lập kế hoạch chi tiết (Implementation Plan) và hỏi ý kiến/chờ người dùng duyệt trước khi sửa code hoặc thực thi thay đổi.
---

# Quy Trình Bắt Buộc: Lập Kế Hoạch & Hỏi Người Dùng Trước Khi Làm

## 1. Nguyên Tắc Cốt Lõi
Khi làm việc với người dùng trong dự án này:
- **TUYỆT ĐỐI KHÔNG TỰ Ý SỬA CODE NGAY LẬP TỨC** khi chưa trình bày kế hoạch và nhận được sự đồng ý từ người dùng.
- Luôn chia quy trình xử lý thành 2 giai đoạn rõ ràng: **Lập Kế Hoạch (Planning)** và **Thực Thi (Execution)**.

---

## 2. Các Bước Thực Hiện Chi Tiết

### Giai đoạn 1: Nghiên Cứu & Trình Bày Kế Hoạch (Research & Planning)
1. **Nghiên cứu kỹ lưỡng:**
   - Dùng các công cụ đọc file (`view_file`, `grep_search`) để tìm hiểu nguyên nhân gốc rễ, các file liên quan và logic nghiệp vụ.
   - Không thực hiện bất kỳ lệnh ghi/sửa code nào trong bước này.
2. **Soạn thảo Kế hoạch Chi tiết:**
   - **Tóm tắt vấn đề:** Mô tả lỗi hoặc yêu cầu nghiệp vụ.
   - **Nguyên nhân cốt lõi:** Chỉ rõ tại sao lỗi xảy ra (dẫn chứng dòng code cụ thể).
   - **Phương án giải quyết:** Trình bày rõ các bước kỹ thuật sẽ làm.
   - **Danh sách file thay đổi:** Liệt kê các file FE / BE cần sửa hoặc tạo mới.
   - **Kế hoạch kiểm chứng:** Lệnh test, build và kịch bản test thực tế.
3. **Dừng lại & Đợi Phê Duyệt:**
   - Trình bày kế hoạch rõ ràng, dễ hiểu bằng tiếng Việt.
   - **DỪNG LẠI và hỏi người dùng:** *"Bạn có đồng ý với kế hoạch này để tôi tiến hành sửa code không?"*.

---

### Giai đoạn 2: Thực Thi Sau Khi Được Duyệt (Execution)
- Chỉ khi người dùng phản hồi **"Đồng ý" / "OK" / "Làm đi"**, mới bắt đầu dùng các công cụ chỉnh sửa code (`replace_file_content`, `write_to_file`).
- Sau khi sửa code xong:
  - Chạy `npx tsc --noEmit` (Frontend) hoặc `dotnet build` (Backend) để đảm bảo 0 lỗi.
  - Báo cáo kết quả chi tiết cho người dùng.
