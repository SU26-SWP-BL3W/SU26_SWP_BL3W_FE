"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "@/i18n/routing";

export interface NotificationItem {
  id: string;
  type: "invitation" | "system" | "appeal" | "submission";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionUrl?: string;
  actionType?: "accept_team_invite";
}

interface NotificationBellProps {
  align?: "left" | "right";
}

export function NotificationBell({ align = "left" }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-01",
      type: "invitation",
      title: "Lời Mời Gia Nhập Đội Thi",
      message: "Trưởng đội Nguyễn Văn Leader đã mời bạn gia nhập đội Cyber_Knights.",
      time: "10 phút trước",
      isRead: false,
      actionUrl: "/my-team",
      actionType: "accept_team_invite",
    },
    {
      id: "notif-02",
      type: "appeal",
      title: "Phản Hồi Đơn Phúc Khảo",
      message: "Ban Tổ Chức đã chấp thuận đơn phúc khảo cho bài nộp Vòng Sơ Loại.",
      time: "2 giờ trước",
      isRead: false,
      actionUrl: "/appeals",
    },
    {
      id: "notif-03",
      type: "system",
      title: "Công Bố Kết Quả Vòng 1",
      message: "Bảng xếp hạng chính thức Vòng Sơ Loại SEAL Hackathon 2026 đã công bố.",
      time: "1 ngày trước",
      isRead: true,
      actionUrl: "/events/event-seal-2026/leaderboard",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleAction = (id: string, actionName: string) => {
    alert(`[NOTIFICATION ACTION] ${actionName} cho thông báo: #${id}`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* ── Bell Icon Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 hud-clipped transition-all border ${
          isOpen
            ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] shadow-[0_0_12px_rgba(0,217,255,0.2)]"
            : "border-[var(--border-muted)] bg-[var(--bg-input)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/60"
        }`}
        title="Thông Báo In-App"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread Red Neon Badge Counter */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-danger)] font-mono text-[9px] font-extrabold text-white animate-pulse shadow-[0_0_8px_#EF4444]">
            {unreadCount}
          </span>
        )}
      </button>

      {/* ── Notifications HUD Popover Panel ── */}
      {isOpen && (
        <div
          className={`bg-[var(--bg-panel)] border border-[var(--accent-primary)]/50 shadow-2xl hud-clipped z-[100] overflow-hidden flex flex-col font-mono text-xs animate-in fade-in zoom-in-95 duration-150 ${
            align === "right"
              ? "absolute right-0 top-full mt-2 w-80 md:w-96"
              : "fixed left-4 top-16 md:left-6 md:top-14 w-80 md:w-96"
          }`}
        >
          
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-[var(--bg-base)] border-b border-[var(--border-muted)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
              <span className="font-bold text-[var(--accent-primary)] tracking-wider uppercase text-[11px]">
                THÔNG BÁO IN-APP ({unreadCount})
              </span>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] text-[var(--text-muted)] hover:text-white underline transition-colors"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          {/* List of Notifications */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border-muted)]/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-[var(--text-muted)] italic">
                Không có thông báo mới nào
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 flex flex-col gap-1.5 transition-colors ${
                    !item.isRead ? "bg-[var(--accent-primary)]/5" : "hover:bg-[var(--bg-input)]/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {!item.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-danger)]" />
                      )}
                      <span className="font-bold text-[var(--text-primary)] text-xs">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)]">{item.time}</span>
                  </div>

                  <p className="font-sans text-xs text-[var(--text-muted)] leading-relaxed">
                    {item.message}
                  </p>

                  {/* Actions for invitations */}
                  {item.actionType === "accept_team_invite" && (
                    <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
                      <button
                        onClick={() => handleAction(item.id, "Chấp nhận lời mời Đội thi")}
                        className="px-2.5 py-1 bg-[var(--color-success)]/20 text-[var(--color-success)] border border-[var(--color-success)]/40 font-bold uppercase hover:bg-[var(--color-success)] hover:text-black transition-all"
                      >
                        ✓ CHẤP NHẬN
                      </button>
                      <button
                        onClick={() => handleAction(item.id, "Từ chối lời mời")}
                        className="px-2.5 py-1 bg-[var(--color-danger)]/10 text-[var(--color-danger)] border border-[var(--color-danger)]/30 font-bold uppercase hover:bg-[var(--color-danger)] hover:text-white transition-all"
                      >
                        ✕ TỪ CHỐI
                      </button>
                    </div>
                  )}

                  {/* Link action if present */}
                  {item.actionUrl && item.actionType !== "accept_team_invite" && (
                    <Link
                      href={item.actionUrl}
                      onClick={() => setIsOpen(false)}
                      className="text-[10px] text-[var(--accent-primary)] font-bold hover:underline self-start pt-0.5"
                    >
                      Xem chi tiết ➔
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 text-center bg-[var(--bg-base)] border-t border-[var(--border-muted)] text-[10px] text-[var(--text-muted)]">
            Tự động cập nhật mỗi 30 giây (Polling Sync)
          </div>
        </div>
      )}
    </div>
  );
}
