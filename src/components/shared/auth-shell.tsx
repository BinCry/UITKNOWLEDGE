import Image from "next/image";
import Link from "next/link";
import { APP_NAME, FORGOT_PASSWORD_PATH, LOGIN_PATH, RESET_PASSWORD_PATH } from "@/lib/constants";

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden rounded-[2.5rem] border border-black/10 bg-black p-8 text-white shadow-2xl lg:block">
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-6">
              <div className="relative size-16 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <Image src="/logo.jpg" alt={APP_NAME} fill sizes="64px" className="object-cover" />
              </div>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">UIT Knowledge</p>
                <h1 className="text-4xl font-semibold text-balance">Khu vực quản trị</h1>
                <p className="max-w-md text-sm leading-7 text-white/70">
                  Đăng nhập để cập nhật trang chủ, khóa học, video, merch và các thông tin vận hành của UIT Knowledge.
                </p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-white/60">
              <Link href={LOGIN_PATH} className="block hover:text-white">
                Đăng nhập quản trị
              </Link>
              <Link href={FORGOT_PASSWORD_PATH} className="block hover:text-white">
                Quên mật khẩu
              </Link>
              <Link href={RESET_PASSWORD_PATH} className="block hover:text-white">
                Đặt lại mật khẩu
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-black/10 bg-white/92 p-6 shadow-lg backdrop-blur sm:p-8 lg:p-10">
          <div className="mb-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-black/40">Quản trị nội dung</p>
            <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
            <p className="max-w-xl text-sm leading-7 text-black/60">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
