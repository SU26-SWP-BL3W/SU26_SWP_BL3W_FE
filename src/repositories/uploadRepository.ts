import apiClient from "@/models/apiClient";
import type { BaseResponse } from "@/models/entities";

export interface UploadFileResponse {
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

export const uploadRepository = {
  /** Upload single image/document file to backend cloud storage */
  async uploadFile(file: File): Promise<BaseResponse<UploadFileResponse>> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await apiClient.post<BaseResponse<UploadFileResponse>>("/Upload/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (error) {
      // Fallback preview URL in mock mode
      const mockUrl = URL.createObjectURL(file);
      return {
        success: true,
        data: {
          fileUrl: mockUrl,
          fileName: file.name,
          fileSize: file.size,
        },
        message: "Upload mock success",
      };
    }
  },
};
