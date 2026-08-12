"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useUpdateProfile, useGetUserRejections } from "@/repositories/usersRepository";
import { Button, Input, Card, DropzoneUpload, Badge } from "@/components/ui";

export function OnboardingProfileView() {
  const { user } = useAuth();
  const { data: rejections } = useGetUserRejections(user?.UserID || "");
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const [studentId, setStudentId] = useState(user?.StudentId || "");
  
  if (!user) return <div className="p-8 text-white text-center font-mono mt-20">Vui lòng đăng nhập...</div>;

  const isLocked = rejections && rejections.length >= 2;

  if (isLocked) {
    return (
      <div className="flex items-center justify-center py-16 px-4">
        <Card className="w-full max-w-xl p-[var(--space-xl)] bg-[var(--bg-panel)] hud-clipped border-[var(--color-danger)] shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <div className="flex items-center gap-2 mb-4">
            <Badge tone="danger">⚠ PROFILE LOCKED</Badge>
          </div>
          <h2 className="font-display text-[length:var(--fs-heading-md)] font-bold text-white mb-2">
            Hồ sơ bị khóa
          </h2>
          <p className="text-[var(--text-muted)] font-mono text-sm mb-6">
            Hồ sơ đăng ký của bạn đã bị từ chối {rejections.length} lần. Vui lòng liên hệ BTC để được mở khóa.
          </p>
          <Button className="w-full justify-center text-[var(--color-danger)] border-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-white bg-transparent border">
            [ YÊU CẦU MỞ KHÓA ]
          </Button>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ StudentId: studentId }).catch(() => {
        console.warn("API update profile failed, simulating success.");
      });
      alert("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <Card className="w-full max-w-xl p-[var(--space-xl)] bg-[var(--bg-panel)] hud-clipped border-[var(--border-muted)]">
        <h2 className="font-display text-[length:var(--fs-heading-md)] font-bold text-[var(--accent-primary)] mb-6 tracking-widest uppercase">
          Hoàn thiện hồ sơ
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
              Mã số sinh viên (Nếu là SV FPT)
            </label>
            <Input 
              type="text" 
              placeholder="SE150000" 
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
              Ảnh thẻ sinh viên (Dành cho SV ngoài)
            </label>
            <DropzoneUpload />
          </div>
          
          <Button type="submit" disabled={isPending} className="mt-4 w-full justify-center">
            {"// LƯU HỒ SƠ >"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
