"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BadgeCheck,
  Blocks,
  DoorOpen,
  GalleryVertical,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Settings2,
  Shield,
  Shirt,
  Sparkles,
  SquarePlay,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

const desktopNav: AdminNavItem[] = [
  { label: "Tổng quan", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Cài đặt chung", href: "/admin/settings", icon: Settings2 },
  { label: "Trang chủ", href: "/admin/landing", icon: Sparkles },
  { label: "Khóa học", href: "/admin/courses", icon: Blocks },
  { label: "Merch", href: "/admin/products", icon: Shirt },
  { label: "Video", href: "/admin/videos", icon: SquarePlay },
  { label: "Cảm nhận", href: "/admin/testimonials", icon: MessageSquareText },
  { label: "Câu hỏi thường gặp", href: "/admin/faq", icon: BadgeCheck },
  { label: "Thư viện ảnh", href: "/admin/media", icon: GalleryVertical },
  { label: "Tài khoản admin", href: "/admin/profile", icon: Shield },
];

const NavigationLink = ({ item, active }: { item: AdminNavItem; active: boolean }) => {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
        active ? "bg-black text-white shadow-sm" : "text-black/70 hover:bg-black/5 hover:text-black",
      )}
    >
      <Icon className="size-4" />
      {item.label}
    </Link>
  );
};

export const adminNav = desktopNav;

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_20%),linear-gradient(180deg,#f7fbff,#fbf8f1)] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 w-full max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-0 lg:px-8 xl:flex-nowrap">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full bg-white xl:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[90vw] max-w-sm overflow-y-auto rounded-r-[2rem] border-r border-black/10 bg-white/95 p-0 [&>button]:right-5 [&>button]:top-5">
                <SheetHeader className="border-b border-black/10 px-5 py-5 text-left">
                  <div className="flex items-center gap-3 pr-10">
                    <span className="relative size-11 overflow-hidden rounded-2xl border border-black/10 bg-black/5">
                      <Image src="/logo.jpg" alt="UIT Knowledge" fill sizes="44px" className="object-cover" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-black/40">Quản trị</p>
                      <SheetTitle className="text-lg font-semibold">UIT Knowledge CMS</SheetTitle>
                    </div>
                  </div>
                  <SheetDescription className="sr-only">
                    Điều hướng nhanh đến các khu vực quản trị nội dung của UIT Knowledge.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex h-full flex-col bg-white">
                  <div className="flex-1 px-4 py-4">
                    <div className="grid gap-1">
                      {desktopNav.map((item) => (
                        <NavigationLink key={item.href} item={item} active={pathname === item.href} />
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <span className="relative size-11 overflow-hidden rounded-2xl border border-black/10 bg-black/5">
                <Image src="/logo.jpg" alt="UIT Knowledge" fill sizes="44px" className="object-cover" />
              </span>
              <div className="hidden sm:block">
                <p className="text-xs uppercase tracking-[0.3em] text-black/40">UIT Knowledge</p>
                <p className="text-lg font-semibold">Trang quản trị</p>
              </div>
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/60 lg:block">
              Xin chào, <span className="font-semibold text-black">{userName}</span>
            </div>
            <Button
              variant="outline"
              className="rounded-full bg-white"
              onClick={() => {
                void signOut({ callbackUrl: "/" });
              }}
            >
              <DoorOpen className="size-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px] gap-6 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-72 shrink-0 flex-col overflow-hidden rounded-[2rem] border border-black/10 bg-white/85 p-3 shadow-sm backdrop-blur xl:flex">
          <div className="mb-3 rounded-[1.5rem] bg-black px-4 py-4 text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Quản trị nội dung</p>
            <p className="mt-2 text-xl font-semibold">UIT Knowledge</p>
            <p className="mt-1 text-sm leading-6 text-white/70">
              Cập nhật trang chủ, khóa học, video, merch và các thông tin vận hành của website tại một nơi.
            </p>
          </div>
          <nav className="grid gap-1">
            {desktopNav.map((item) => (
              <NavigationLink key={item.href} item={item} active={pathname === item.href} />
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-x-clip">
          <div className="rounded-[2rem] border border-black/10 bg-white/88 p-4 shadow-sm sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
