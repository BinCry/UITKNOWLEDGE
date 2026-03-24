import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpenText, CheckCircle2, GraduationCap } from "lucide-react";
import { CtaBand } from "@/components/public/cta-band";
import { Button } from "@/components/ui/button";
import { buildTrackedCtaHref } from "@/lib/cta";
import { getCourseBySlug } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Khóa học không tồn tại" };

  return {
    title: course.title,
    description: course.shortDescription,
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="surface-panel mesh-panel relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
        <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">{course.category}</span>
              <span className="rounded-full bg-black/6 px-3 py-1 text-xs font-semibold text-black/68">{course.level}</span>
              <span className="rounded-full bg-black/6 px-3 py-1 text-xs font-semibold text-black/68">{course.format}</span>
            </div>
            <div className="space-y-3">
              <p className="eyebrow-label">Khóa học</p>
              <h1 className="text-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-pretty text-slate-950 sm:text-5xl sm:leading-[1.02]">
                {course.title}
              </h1>
              <p className="max-w-3xl text-base leading-8 text-black/64 sm:text-lg">{course.longDescription}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {course.highlights.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white/86 px-4 py-2 text-sm font-medium text-black/68">
                  <CheckCircle2 className="size-4 text-cyan-600" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[2rem] border border-black/8 bg-black text-white shadow-[0_24px_70px_rgba(15,23,42,0.2)]">
              <div className="space-y-5 p-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/45">Đăng ký</p>
                  <p className="text-4xl font-semibold">{course.priceLabel}</p>
                  {course.originalPriceLabel ? <p className="text-sm text-white/55 line-through">{course.originalPriceLabel}</p> : null}
                </div>
                <Button className="w-full rounded-full bg-white text-black hover:bg-white/90" asChild>
                  <Link
                    href={buildTrackedCtaHref({
                      targetType: "COURSE",
                      targetUrl: course.ctaHref,
                      source: "course-detail",
                      targetId: course.id,
                      targetLabel: course.title,
                    })}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Đăng ký khóa học
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <p className="text-sm leading-7 text-white/70">
                  Form đăng ký sẽ mở để bạn để lại thông tin và nhận tư vấn chi tiết theo môn học này.
                </p>
              </div>
            </div>

            <div className="surface-card rounded-[2rem] px-6 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-black/48">Thời lượng</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{course.duration}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black/48">Hình thức</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{course.format}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-card rounded-[2rem] px-6 py-6 sm:px-7">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm font-medium text-black/48">
              <BookOpenText className="size-4" />
              Outline khóa học
            </div>
            <div className="grid gap-3">
              {course.outline.map((item, index) => (
                <div key={item} className="grid gap-3 rounded-[1.4rem] border border-black/8 bg-[#fbfbf8] p-4 sm:grid-cols-[auto_1fr]">
                  <span className="flex size-9 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-black/66">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card rounded-[2rem] px-6 py-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-black/48">
                <GraduationCap className="size-4" />
                Phù hợp với
              </div>
              <ul className="space-y-2 text-sm leading-7 text-black/66">
                {course.audience.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="surface-card rounded-[2rem] px-6 py-6">
            <div className="space-y-4">
              <p className="text-sm font-medium text-black/48">Tags</p>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-black/5 px-3 py-1.5 text-xs text-black/66">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CtaBand
        title="Muốn xem thêm video liên quan?"
        description="Bạn có thể chuyển tiếp sang phần video hoặc xem merch dành cho cộng đồng theo dõi kênh."
        primaryHref="/video"
        primaryLabel="Xem video"
        secondaryHref="/merch"
        secondaryLabel="Xem merch"
      />
    </main>
  );
}
