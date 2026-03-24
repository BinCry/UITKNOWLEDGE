"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { FORGOT_PASSWORD_PATH } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const result = await signIn("credentials", {
        redirect: false,
        identifier,
        password,
        callbackUrl: nextPath || "/admin/dashboard",
      });

      if (!result || result.error) {
        toast.error("Đăng nhập không thành công. Vui lòng kiểm tra lại tài khoản quản trị.");
        return;
      }

      router.push(result.url ?? nextPath ?? "/admin/dashboard");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="space-y-2">
        <Label htmlFor="identifier">Username hoặc email</Label>
        <Input
          id="identifier"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          placeholder="Nhập tài khoản quản trị"
          autoComplete="username"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Nhập mật khẩu"
          autoComplete="current-password"
          required
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={FORGOT_PASSWORD_PATH} className="text-sm text-black/60 underline-offset-4 hover:text-black hover:underline">
          Quên mật khẩu?
        </Link>
        <Button type="submit" className="rounded-full bg-black text-white hover:bg-black/90" disabled={isPending}>
          {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </div>
    </form>
  );
}
