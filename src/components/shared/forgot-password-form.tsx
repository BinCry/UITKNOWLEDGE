"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { RESET_PASSWORD_PATH } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch("/api/auth/reset-request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json()) as { success: boolean; data?: { message: string }; error?: { message: string } };

      if (!payload.success) {
        toast.error(payload.error?.message ?? "Không gửi được OTP");
        return;
      }

      toast.success(payload.data?.message ?? "OTP đã được gửi");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email admin</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Nhập email quản trị"
          required
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={RESET_PASSWORD_PATH} className="text-sm text-black/60 underline-offset-4 hover:text-black hover:underline">
          Đã có OTP?
        </Link>
        <Button type="submit" className="rounded-full bg-black text-white hover:bg-black/90" disabled={isPending}>
          {isPending ? "Đang gửi..." : "Gửi OTP"}
        </Button>
      </div>
    </form>
  );
}
