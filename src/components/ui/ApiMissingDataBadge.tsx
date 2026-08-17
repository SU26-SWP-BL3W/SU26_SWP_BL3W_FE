"use client";

import React from "react";
import { Info, Database } from "lucide-react";

interface ApiMissingDataBadgeProps {
  endpoint?: string;
  title?: string;
  message?: string;
  className?: string;
  showEndpoint?: boolean;
}

export const ApiMissingDataBadge: React.FC<ApiMissingDataBadgeProps> = ({
  endpoint,
  title = "CHƯA CÓ DỮ LIỆU TỪ HỆ THỐNG",
  message = "Hiện tại chưa có bản ghi dữ liệu phù hợp để hiển thị.",
  className = "",
  showEndpoint = false,
}) => {
  return (
    <div
      className={`p-5 bg-[var(--bg-panel)] border border-[var(--border-muted)] text-[var(--text-muted)] font-mono text-xs hud-clipped space-y-2 animate-fade-in ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] pb-2">
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[var(--text-primary)]">
          <Info className="w-4 h-4 text-[var(--accent-primary)] flex-shrink-0" />
          <span>{title}</span>
        </div>
      </div>

      <div className="space-y-1 text-[11px]">
        <p className="text-[var(--text-muted)]">{message}</p>
        {showEndpoint && endpoint && (
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-[10px] pt-1">
            <Database className="w-3 h-3 text-[var(--text-muted)]" />
            <span>Ref:</span>
            <code className="px-1.5 py-0.5 bg-black/40 text-[var(--accent-primary)]">
              {endpoint}
            </code>
          </div>
        )}
      </div>
    </div>
  );
};
