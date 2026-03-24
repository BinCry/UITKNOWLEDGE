"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenText,
  Facebook,
  LogIn,
  Mail,
  Menu,
  MessageCircleMore,
  Phone,
  ShieldCheck,
  Youtube,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LOGIN_PATH } from "@/lib/constants";
import { siteNavigation } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const learningTracks = ["Giải tích", "Đại số tuyến tính", "NMLT", "OOP", "DSA", "Mạng máy tính", "CSDL", "Hệ điều hành"];

export const PublicShell = ({
  children,
  brandName,
  slogan,
  description,
  facebookUrl,
  zaloPhone,
  contactEmail,
}: {
  children: React.ReactNode;
  brandName: string;
  slogan: string;
  description: string;
  facebookUrl: string;
  zaloPhone: string;
  contactEmail: string;
}) => {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  const contactShortcuts = [
    { label: "Facebook", href: facebookUrl, icon: Facebook },
    { label: "Zalo", href: `https://zalo.me/${zaloPhone}`, icon: MessageCircleMore },
    { label: "Email", href: `mailto:${contactEmail}`, icon: Mail },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-transparent text-foreground">
      <div className="hidden border-b border-black/6 bg-white/58 backdrop-blur-xl md:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs text-black/58 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-black/8 bg-white/84 px-3 py-1.5 font-medium text-black/72">
              Nền tảng nội dung cho sinh viên UIT
            </span>
            <span className="hidden lg:inline">
              Video, khóa học và merch được tách rõ để bạn tra cứu nhanh và theo dõi thuận tiện hơn.
            </span>
          </div>

          <div className="hidden items-center gap-5 lg:flex">
            <Link href={facebookUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-black">
              Facebook
            </Link>
            <a href={`https://zalo.me/${zaloPhone}`} className="transition-colors hover:text-black">
              Zalo: {zaloPhone}
            </a>
            <a href={`mailto:${contactEmail}`} className="transition-colors hover:text-black">
              {contactEmail}
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
        <div className="mx-auto max-w-7xl">
          <div className="surface-panel flex items-center justify-between gap-4 rounded-[1.9rem] px-4 py-3 sm:px-5 lg:px-6">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-black p-1.5 shadow-sm">
                <Image
                  src="/logo.jpg"
                  alt={`${brandName} logo`}
                  fill
                  sizes="48px"
                  className="rounded-[14px] object-contain"
                  priority
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.34em] text-black/40">{slogan}</span>
                <span className="block truncate text-lg font-semibold text-black">{brandName}</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1.5 lg:flex">
              {siteNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2.5 text-sm font-medium transition-all",
                    isActive(item.href)
                      ? "bg-black text-white shadow-[0_14px_24px_rgba(15,23,42,0.16)]"
                      : "text-black/64 hover:bg-black/[0.04] hover:text-black",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-black/10 bg-white/84 px-4 text-black/76 hover:bg-white"
                asChild
              >
                <Link href="/lien-he">
                  <Phone className="size-4" />
                  Liên hệ nhanh
                </Link>
              </Button>
              <Button className="rounded-full bg-black px-4 text-white hover:bg-black/90" size="sm" asChild>
                <Link href={LOGIN_PATH}>
                  <ShieldCheck className="size-4" />
                  Quản trị
                </Link>
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full border-black/10 bg-white/84 lg:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[88vw] max-w-sm border-l-black/10 p-0">
                <SheetTitle className="sr-only">Điều hướng chính của UIT Knowledge</SheetTitle>
                <div className="flex h-full flex-col bg-[#fcfcfa]">
                  <div className="border-b border-black/6 px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span className="relative flex size-12 items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-black p-1.5">
                        <Image
                          src="/logo.jpg"
                          alt={`${brandName} logo`}
                          fill
                          sizes="48px"
                          className="rounded-[14px] object-contain"
                        />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/40">{slogan}</p>
                        <p className="text-lg font-semibold">{brandName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-1 px-4 py-4">
                    {siteNavigation.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "rounded-2xl px-4 py-3 text-base font-medium transition-colors",
                          isActive(item.href) ? "bg-black text-white" : "hover:bg-black/[0.04]",
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}

                    <Link
                      href={LOGIN_PATH}
                      className="mt-3 flex items-center justify-between rounded-2xl border border-black/10 bg-white px-4 py-3 text-base font-medium"
                    >
                      Đăng nhập quản trị
                      <LogIn className="size-4" />
                    </Link>
                  </div>

                  <div className="border-t border-black/6 p-4">
                    <div className="grid gap-2">
                      {contactShortcuts.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.label}
                            variant="outline"
                            asChild
                            className="justify-start rounded-2xl border-black/10 bg-white"
                          >
                            <Link href={item.href} target="_blank" rel="noreferrer">
                              <Icon className="size-4" />
                              {item.label}
                            </Link>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="pb-20 md:pb-0">{children}</div>

      <div className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 2xl:flex 2xl:flex-col 2xl:gap-3">
        {contactShortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.label}
              variant="outline"
              size="icon"
              className="pointer-events-auto size-12 rounded-full border-black/10 bg-white/90 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur"
              asChild
            >
              <Link href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                <Icon className="size-4" />
              </Link>
            </Button>
          );
        })}
      </div>

      <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
        <div className="surface-panel grid grid-cols-2 gap-2 rounded-[1.4rem] p-2">
          <Button className="rounded-[0.95rem] bg-black text-white hover:bg-black/90" asChild>
            <Link href="/khoa-hoc">Khóa học</Link>
          </Button>
          <Button variant="outline" className="rounded-[0.95rem] border-black/10 bg-white" asChild>
            <Link href={`https://zalo.me/${zaloPhone}`} target="_blank" rel="noreferrer">
              <Phone className="size-4" />
              Zalo
            </Link>
          </Button>
        </div>
      </div>

      <footer className="mt-16 border-t border-black/6 bg-white/68 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="surface-panel overflow-hidden rounded-[2.1rem] px-6 py-8 sm:px-8 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.75fr_0.8fr_0.95fr]">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <span className="relative flex size-14 items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-black p-2">
                    <Image
                      src="/logo.jpg"
                      alt={`${brandName} logo`}
                      fill
                      sizes="56px"
                      className="rounded-[16px] object-contain"
                    />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/42">{slogan}</p>
                    <p className="text-2xl font-semibold text-black">{brandName}</p>
                  </div>
                </div>

                <p className="max-w-xl text-sm leading-7 text-black/62">{description}</p>

                <div className="flex flex-wrap gap-3">
                  {contactShortcuts.map((item) => (
                    <Button
                      key={item.label}
                      variant="outline"
                      size="sm"
                      asChild
                      className="rounded-full border-black/10 bg-white/88"
                    >
                      <Link href={item.href} target="_blank" rel="noreferrer">
                        {item.label}
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-black/40">Điều hướng</p>
                <div className="grid gap-3 text-sm text-black/68">
                  {siteNavigation.map((item) => (
                    <Link key={item.href} href={item.href} className="transition-colors hover:text-black">
                      {item.label}
                    </Link>
                  ))}
                  <Link href={LOGIN_PATH} className="transition-colors hover:text-black">
                    Quản trị
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-black/40">Nhóm môn</p>
                <div className="grid gap-2 text-sm text-black/68">
                  {learningTracks.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <BookOpenText className="size-3.5 text-cyan-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-black/40">Liên hệ</p>
                <div className="space-y-3 text-sm leading-7 text-black/68">
                  <p>Facebook: GenCanyon</p>
                  <p>Zalo: {zaloPhone} - Phan Trong Dinh</p>
                  <p>Email: {contactEmail}</p>
                </div>

                <div className="rounded-[1.4rem] border border-black/8 bg-black px-4 py-4 text-white">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/52">Định hướng nội dung</p>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    Ưu tiên video ôn tập, khóa học theo môn và nội dung bám sát nhu cầu học tập của sinh viên UIT.
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 text-sm text-white/74">
                    <Youtube className="size-4" />
                    Nội dung được sắp theo từng môn học
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-black/6 pt-5 text-xs text-black/46">
              UIT Knowledge. Giao diện tối ưu cho desktop và mobile, ưu tiên tra cứu nhanh đúng môn và đúng nội dung cần học.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
