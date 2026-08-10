"use client";

import { Badge, Card } from "@/components/ui";
import { useBackendHealthViewModel } from "@/viewModels/useBackendHealthViewModel";

// View — chỉ render, không tự gọi API hay giữ state riêng. Toàn bộ dữ liệu
// và logic lấy từ ViewModel.
export function HomeView() {
  const { apiUrl, status, isLoading, isError } = useBackendHealthViewModel();

  return (
    <main className="mx-auto flex max-w-[var(--container-max)] flex-1 flex-col items-start gap-[var(--space-lg)] p-[var(--space-xl)]">
      <h1 className="text-[var(--fs-heading-lg)] font-semibold text-[var(--color-ink)]">
        SEAL — khung scaffold
      </h1>
      <Card className="flex items-center gap-[var(--space-md)]">
        <span className="text-[var(--fs-body-md)] text-[var(--color-mute)]">
          Kết nối tới backend ({apiUrl}):
        </span>
        {isLoading && <Badge tone="neutral">đang kiểm tra…</Badge>}
        {isError && <Badge tone="error">không kết nối được</Badge>}
        {status && <Badge tone="success">{status}</Badge>}
      </Card>
    </main>
  );
}
