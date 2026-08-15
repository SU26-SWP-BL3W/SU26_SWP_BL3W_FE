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
        const list = res.data?.data;
        if (Array.isArray(list) && list.length > 0) return list;
      } catch (err: any) {
        console.warn("[SEAL BE-DATA MISSING] GET /api/Criterias error:", err?.message);
      }
      return [];
    },
  });
}

export function useGetTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<BaseResponse<TemplateEntity[]>>("/Templates");
        const list = res.data?.data;
        if (Array.isArray(list) && list.length > 0) return list;
      } catch (err: any) {
        console.warn("[SEAL BE-DATA MISSING] GET /api/Templates error:", err?.message);
      }
      return [];
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

export const DEFAULT_CRITERIAS_LIST: CriteriaEntity[] = [
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

export const DEFAULT_TEMPLATES_LIST: TemplateEntity[] = [
  {
    id: "tpl-default-ai",
    templateId: "tpl-default-ai",
    TemplateId: "tpl-default-ai",
    templateName: "Mẫu Tiêu Chí Chuẩn SEAL AI & Tech (100%)",
    criterias: DEFAULT_CRITERIAS_LIST,
  },
  {
    id: "tpl-default-web",
    templateId: "tpl-default-web",
    TemplateId: "tpl-default-web",
    templateName: "Mẫu Khảo Sát Web & Product (100%)",
    criterias: DEFAULT_CRITERIAS_LIST,
  },
];

export const templatesRepository = {
  async getAllTemplates(): Promise<BaseResponse<TemplateEntity[]>> {
    try {
      const res = await apiClient.get<BaseResponse<TemplateEntity[]>>("/Templates");
      return res.data;
    } catch (err: any) {
      console.warn("[SEAL BE-DATA MISSING] GET /api/Templates error:", err?.message);
      return {
        data: [],
        message: "Chưa có dữ liệu Templates từ Backend",
        statusCode: 404,
        success: false,
      };
    }
  },

  async getAllCriterias(): Promise<BaseResponse<CriteriaEntity[]>> {
    try {
      const res = await apiClient.get<BaseResponse<CriteriaEntity[]>>("/Criterias");
      return res.data;
    } catch (err: any) {
      console.warn("[SEAL BE-DATA MISSING] GET /api/Criterias error:", err?.message);
      return {
        data: [],
        message: "Chưa có dữ liệu Criterias từ Backend",
        statusCode: 404,
        success: false,
      };
    }
  },

  async createCriteria(payload: { criterionName: string; description?: string; maxScore?: number }): Promise<BaseResponse<CriteriaEntity>> {
    const res = await apiClient.post<BaseResponse<CriteriaEntity>>("/Criterias", payload);
    return res.data;
  },

  async createTemplate(payload: CreateTemplatePayload): Promise<BaseResponse<TemplateEntity>> {
    const res = await apiClient.post<BaseResponse<TemplateEntity>>("/Templates", payload);
    return res.data;
  },

  async addCriteriaToTemplate(payload: AddCriteriaToTemplatePayload): Promise<BaseResponse<TemplateCriteriaEntity>> {
    const res = await apiClient.post<BaseResponse<TemplateCriteriaEntity>>(
      `/Templates/${payload.templateId}/criteria`,
      payload
    );
    return res.data;
  },
};
