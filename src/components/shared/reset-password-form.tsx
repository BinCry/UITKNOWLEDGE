"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          newPassword,
          confirmPassword,
        }),
      });

      const payload = (await response.json()) as { success: boolean; data?: { message: string }; error?: { message: string } };

      if (!payload.success) {
        toast.error(payload.error?.message ?? "Không đặt lại được mật khẩu");
        return;
      }

      toast.success(payload.data?.message ?? "Đặt lại mật khẩu thành công");
      router.push("/login");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email admin</Label>
          <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="code">OTP</Label>
          <Input id="code" value={code} onChange={(event) => setCode(event.target.value)} inputMode="numeric" required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="newPassword">Mật khẩu mới</Label>
          <Input id="newPassword" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-fit rounded-full bg-black text-white hover:bg-black/90" disabled={isPending}>
        {isPending ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
      </Button>
    </form>
  );
}
