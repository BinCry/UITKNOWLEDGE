"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircleMore, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredSubjects = [
  {
    eyebrow: "Đại cương",
    title: "Giải tích và Đại số tuyến tính",
    description: "Tóm tắt phần trọng tâm để bạn xem lại nhanh trước giờ học hoặc trước kỳ thi.",
    tone: "bg-cyan-50 text-cyan-900",
  },
  {
    eyebrow: "Cơ sở ngành",
    title: "NMLT, OOP và DSA",
    description: "Đi từ nền tảng đến tư duy giải bài theo hướng dễ theo kịp trên lớp.",
    tone: "bg-white text-slate-900",
  },
  {
    eyebrow: "Hệ thống môn",
    title: "Mạng máy tính, CSDL và Hệ điều hành",
    description: "Tập trung vào các khái niệm cốt lõi để ôn nhanh mà vẫn rõ ý chính.",
    tone: "bg-amber-50 text-amber-900",
  },
];

const quickStats = [
  { value: "7+", label: "Nhóm môn trọng tâm" },
  { value: "Video", label: "Tài nguyên ôn tập" },
  { value: "Biểu mẫu", label: "Đăng ký khóa học và mua merch" },
];

export const Hero = ({
  brandName,
  slogan,
  heroTitle,
  heroDescription,
  heroBadge,
  facebookUrl,
}: {
  brandName: string;
  slogan: string;
  heroTitle: string;
  heroDescription: string;
  heroBadge: string;
  facebookUrl: string;
}) => (
  <section className="relative overflow-hidden pt-6 sm:pt-8">
    <div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_12%_12%,rgba(34,211,238,0.2),transparent_24%),radial-gradient(circle_at_92%_0%,rgba(251,191,36,0.18),transparent_26%),radial-gradient(circle_at_60%_82%,rgba(15,23,42,0.08),transparent_28%)]" />

    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-8 pt-6 sm:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:px-8 lg:pb-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-8"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-black/8 bg-white/86 px-4 py-2 text-sm font-medium text-black/72 shadow-sm">
            <Sparkles className="size-4 text-cyan-600" />
            {heroBadge}
          </span>
          <span className="whitespace-nowrap rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">
            Nội dung bám sát UIT
          </span>
        </div>

        <div className="space-y-6">
          <p className="eyebrow-label">{slogan}</p>
          <h1 className="text-display max-w-4xl text-5xl font-semibold leading-[1.1] tracking-[-0.048em] text-pretty text-slate-950 sm:text-6xl sm:leading-[1.08] xl:text-[4.85rem] xl:leading-[1.04]">
            {heroTitle}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-black/64 sm:text-lg">{heroDescription}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button size="lg" className="rounded-full bg-black px-6 text-white hover:bg-black/90" asChild>
            <Link href="/khoa-hoc">
              Xem khóa học
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full border-black/10 bg-white/82 px-6" asChild>
            <Link href="/video">
              Xem video
              <PlayCircle className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="ghost" className="rounded-full px-6 text-black/72 hover:bg-black/[0.04]" asChild>
            <Link href={facebookUrl} target="_blank" rel="noreferrer">
              <MessageCircleMore className="size-4" />
              Xem Facebook
            </Link>
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {quickStats.map((item) => (
            <div key={item.label} className="surface-card rounded-[1.5rem] px-5 py-4">
              <p className="text-xl font-semibold text-slate-950">{item.value}</p>
              <p className="mt-1 text-sm text-black/56">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute left-12 top-10 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-amber-300/22 blur-3xl" />

        <div className="surface-panel mesh-panel rounded-[2.3rem] p-4 sm:p-5">
          <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
            <div className="grid gap-4 xl:grid-rows-[auto_1fr]">
              <div className="overflow-hidden rounded-[1.9rem] bg-zinc-950 p-5 text-white shadow-[0_20px_45px_rgba(15,23,42,0.22)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-white/52">Kênh học tập</p>
                    <p className="mt-1 text-lg font-semibold">{brandName}</p>
                    <p className="mt-1 text-sm text-white/58">{slogan}</p>
                  </div>
                  <span className="whitespace-nowrap rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] text-white/74">
                    UIT
                  </span>
                </div>

                <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 p-4">
                  <Image
                    src="/logo.jpg"
                    alt={`${brandName} logo`}
                    width={720}
                    height={720}
                    className="aspect-square w-full rounded-[1rem] object-contain"
                    priority
                  />
                </div>

                <p className="mt-4 text-sm leading-6 text-white/78">
                  Nội dung được chia theo từng môn để bạn tìm đúng phần cần xem lại và ôn tập đúng trọng tâm.
                </p>
              </div>

              <div className="surface-card rounded-[1.6rem] border border-black/8 bg-white/92 px-5 py-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-black/42">Lộ trình ôn tập</p>
                <p className="mt-3 text-sm leading-7 text-black/64">
                  Bám các môn nền tảng ở UIT, ưu tiên nội dung ngắn gọn và dễ tra cứu trước giờ học hoặc trước kỳ thi.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["NMLT", "OOP", "DSA"].map((item) => (
                    <span
                      key={item}
                      className="whitespace-nowrap rounded-full border border-black/8 bg-black/[0.03] px-3 py-1 text-[11px] text-black/64"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {featuredSubjects.map((item) => (
                <div key={item.title} className={`surface-card rounded-[1.55rem] px-5 py-5 ${item.tone}`}>
                  <p className="text-[11px] uppercase tracking-[0.3em] opacity-55">{item.eyebrow}</p>
                  <h2 className="mt-3 text-2xl font-semibold leading-[1.2] text-pretty">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 opacity-78">{item.description}</p>
                </div>
              ))}

              <div className="surface-card rounded-[1.55rem] border-dashed px-5 py-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-black/42">Cách dùng website</p>
                <div className="mt-3 grid gap-3 text-sm leading-7 text-black/64 sm:grid-cols-2">
                  <div>
                    <p className="font-semibold text-slate-950">Xem video</p>
                    <p>Tìm đúng môn và đúng chủ đề để xem lại nhanh khi cần.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">Đăng ký khóa học</p>
                    <p>Mở biểu mẫu riêng để giữ luồng đăng ký ngắn gọn và rõ ràng.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);
