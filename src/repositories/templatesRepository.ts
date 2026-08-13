import { useQuery } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import { CriteriaEntity, TemplateCriteriaEntity, TemplateEntity } from "@/models/entities";
import { BaseResponse } from "@/models/types";

export function useGetCriterias() {
  return useQuery({
    queryKey: ["criterias"],
    queryFn: async () => {
      const res = await apiClient.get<BaseResponse<CriteriaEntity[]>>("/Criterias");
      return res.data?.data ?? MOCK_DEFAULT_CRITERIAS;
    },
  });
}

export interface CreateTemplatePayload {
  templateName: string;
  description?: string;
}

export interface AddCriteriaToTemplatePayload {
  templateId: string;
  criteriaId: string;
  weight: number; // 0-100%
  maxScore: number; // e.g. 10
}

export const MOCK_DEFAULT_CRITERIAS: CriteriaEntity[] = [
  {
    CriteriaId: "crit-1",
    CriterionName: "Tính đổi mới & sáng tạo (Innovation)",
    Description: "Đánh giá mức độ độc đáo của giải pháp công nghệ.",
    MaxScore: 10,
    Weight: 30,
    IsActive: true,
  },
  {
    CriteriaId: "crit-2",
    CriterionName: "Kiến trúc hệ thống & Code Quality",
    Description: "Đánh giá thiết kế hệ thống, độ sạch của mã nguồn & khả năng mở rộng.",
    MaxScore: 10,
    Weight: 40,
    IsActive: true,
  },
  {
    CriteriaId: "crit-3",
    CriterionName: "Trải nghiệm người dùng (UX/UI)",
    Description: "Giao diện trực quan, mượt mà và dễ sử dụng.",
    MaxScore: 10,
    Weight: 15,
    IsActive: true,
  },
  {
    CriteriaId: "crit-4",
    CriterionName: "Kỹ năng thuyết trình & Đô thị thực chiến",
    Description: "Khả năng trình bày sản phẩm và trả lời phản biện của Giám khảo.",
    MaxScore: 10,
    Weight: 15,
    IsActive: true,
  },
];

export const templatesRepository = {
  /**
   * Lấy danh sách tất cả tiêu chí khả dụng trong hệ thống (GET /api/Criterias)
   */
  async getAllCriterias(): Promise<BaseResponse<CriteriaEntity[]>> {
    try {
      const res = await apiClient.get<BaseResponse<CriteriaEntity[]>>("/api/Criterias");
      return res.data;
    } catch (err: any) {
      return {
        data: MOCK_DEFAULT_CRITERIAS,
        message: "Lấy danh sách tiêu chí mẫu (Mock Mode)",
        statusCode: 200,
        success: true,
      };
    }
  },

  /**
   * Tạo Mẫu tiêu chí (Template) mới (POST /api/Templates)
   */
  async createTemplate(payload: CreateTemplatePayload): Promise<BaseResponse<TemplateEntity>> {
    try {
      const res = await apiClient.post<BaseResponse<TemplateEntity>>("/api/Templates", payload);
      return res.data;
    } catch (err: any) {
      const mockCreated: TemplateEntity = {
        TemplateId: `tpl-${Date.now()}`,
        TemplateName: payload.templateName,
        Description: payload.description,
      };
      return {
        data: mockCreated,
        message: "Tạo template thành công (Mock Mode)",
        statusCode: 200,
        success: true,
      };
    }
  },

  /**
   * Thêm tiêu chí vào Template kèm Trọng số & MaxScore (POST /api/Templates/{id}/criteria)
   */
  async addCriteriaToTemplate(payload: AddCriteriaToTemplatePayload): Promise<BaseResponse<TemplateCriteriaEntity>> {
    try {
      const res = await apiClient.post<BaseResponse<TemplateCriteriaEntity>>(
        `/api/Templates/${payload.templateId}/criteria`,
        payload
      );
      return res.data;
    } catch (err: any) {
      const criteriaObj = MOCK_DEFAULT_CRITERIAS.find((c) => c.CriteriaId === payload.criteriaId);
      const mockItem: TemplateCriteriaEntity = {
        TemplateId: payload.templateId,
        CriteriaId: payload.criteriaId,
        CriterionName: criteriaObj?.CriterionName || "Tiêu chí chấm điểm",
        Description: criteriaObj?.Description || "",
        Weight: payload.weight,
        MaxScore: payload.maxScore,
      };
      return {
        data: mockItem,
        message: "Thêm tiêu chí vào mẫu thành công (Mock Mode)",
        statusCode: 200,
        success: true,
      };
    }
  },
};
