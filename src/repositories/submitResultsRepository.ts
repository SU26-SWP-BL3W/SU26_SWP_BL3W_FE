import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/models/apiClient";

export interface SubmitResult {
  SubmitResultId: string;
  TeamId: string;
  TrackId: string;
  SubmissionUrl: string;
  Description?: string;
  IsEliminated: boolean;
}

export function useMySubmissions() {
  return useQuery({
    queryKey: ["my-submissions"],
    queryFn: async () => {
      const res = await apiClient.get<SubmitResult[]>("/Teams/my-submissions");
      return res.data;
    },
  });
}

export function useCreateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<SubmitResult, "SubmitResultId" | "IsEliminated">) => {
      const res = await apiClient.post("/SubmitResults", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
    },
  });
}
