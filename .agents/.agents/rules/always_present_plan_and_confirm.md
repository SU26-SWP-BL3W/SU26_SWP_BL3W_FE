---
trigger: always_on
---

# Quy Tắc Bắt Buộc: Luôn Trình Bày Kế Hoạch & Hỏi Người Dùng Trước Khi Sửa Code

## Yêu Cầu Tối Cao:
1. **Trước khi thực hiện bất kỳ thay đổi nào về mã nguồn (Code modification)**:
   - Phải nghiên cứu và trình bày **Kế hoạch Thực hiện (Implementation Plan)** chi tiết cho người dùng.
   - Kế hoạch phải nêu rõ:
     - 🎯 **Mục tiêu & Tóm tắt vấn đề**.
     - 🔍 **Nguyên nhân cốt lõi**.
     - 🛠️ **Các bước giải quyết cụ thể & Danh sách file cần sửa**.
     - 🧪 **Kế hoạch kiểm chứng (Build & Test)**.
2. **Dừng Lại Chờ Duyệt**:
   - **Tuyệt đối không tự ý viết code, tạo file hay sửa code** trước khi người dùng phản hồi đồng ý hoặc phê duyệt kế hoạch.
   - Luôn kết thúc lượt trao đổi bằng câu hỏi xin ý kiến hoặc xác nhận từ người dùng.
3. **Thực thi kỷ luật**:
   - Sau khi người dùng đồng ý, mới bắt tay vào sửa code.
   - Kiểm tra kỹ lỗi TypeScript (`tsc`) và Dotnet Build trước khi báo cáo kết quả.
