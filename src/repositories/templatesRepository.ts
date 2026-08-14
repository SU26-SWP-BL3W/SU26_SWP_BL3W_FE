import { useQuery } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";
import { CriteriaEntity, TemplateCriteriaEntity, TemplateEntity } from "@/models/entities";
import { BaseResponse } from "@/models/types";

export function useGetCriterias() {
  return useQuery({
    queryKey: ["criterias"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<CriteriaEntity[]>>("/Criterias");
        return res.data?.data ?? MOCK_DEFAULT_CRITERIAS;
      } catch {
        return MOCK_DEFAULT_CRITERIAS;
      }
    },
  });
}

export function useGetTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<TemplateEntity[]>>("/Templates");
        return res.data?.data ?? MOCK_DEFAULT_TEMPLATES;
      } catch {
        return MOCK_DEFAULT_TEMPLATES;
      }
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

export const MOCK_DEFAULT_TEMPLATES: TemplateEntity[] = [
  {
    id: "tpl-default-ai",
    templateId: "tpl-default-ai",
    TemplateId: "tpl-default-ai",
    templateName: "Mẫu Tiêu Chí Chuẩn SEAL AI & Tech (100%)",
    criterias: MOCK_DEFAULT_CRITERIAS,
  },
  {
    id: "tpl-default-web",
    templateId: "tpl-default-web",
    TemplateId: "tpl-default-web",
    templateName: "Mẫu Khảo Sát Web & Product (100%)",
    criterias: MOCK_DEFAULT_CRITERIAS,
  },
];

export const templatesRepository = {
  async getAllCriterias(): Promise<BaseResponse<CriteriaEntity[]>> {
    try {
      const res = await apiClient.get<BaseResponse<CriteriaEntity[]>>("/Criterias");
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

  async createCriteria(payload: { criterionName: string; description?: string; maxScore?: number }): Promise<BaseResponse<CriteriaEntity>> {
    try {
      const res = await apiClient.post<BaseResponse<CriteriaEntity>>("/Criterias", payload);
      return res.data;
    } catch {
      return {
        data: {
          CriteriaId: `crit-${Date.now()}`,
          CriterionName: payload.criterionName,
          Description: payload.description,
          MaxScore: payload.maxScore || 10,
          IsActive: true,
        },
        message: "Tạo tiêu chí thành công (Mock)",
        statusCode: 200,
        success: true,
      };
    }
  },

  async createTemplate(payload: CreateTemplatePayload): Promise<BaseResponse<TemplateEntity>> {
    try {
      const res = await apiClient.post<BaseResponse<TemplateEntity>>("/Templates", payload);
      return res.data;
    } catch (err: any) {
      const mockCreated: any = {
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

  async addCriteriaToTemplate(payload: AddCriteriaToTemplatePayload): Promise<BaseResponse<TemplateCriteriaEntity>> {
    try {
      const res = await apiClient.post<BaseResponse<TemplateCriteriaEntity>>(
        `/Templates/${payload.templateId}/criteria`,
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
