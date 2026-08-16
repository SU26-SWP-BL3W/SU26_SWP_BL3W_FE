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

export const DEFAULT_CRITERIAS_LIST: CriteriaEntity[] = [];

export const DEFAULT_TEMPLATES_LIST: TemplateEntity[] = [];

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
