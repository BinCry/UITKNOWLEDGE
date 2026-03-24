import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CatalogCard } from "@/components/public/catalog-card";
import { CatalogToolbar } from "@/components/public/catalog-toolbar";
import { CtaBand } from "@/components/public/cta-band";
import { PageIntro } from "@/components/public/page-intro";
import { Button } from "@/components/ui/button";
import { buildTrackedCtaHref } from "@/lib/cta";
import { listCourses } from "@/lib/site";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  category?: string;
  sort?: string;
};

export const metadata: Metadata = {
  title: "Khóa học",
  description: "Danh sách khóa học theo từng môn của UIT Knowledge.",
};

export default async function CoursesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolved = await searchParams;
  const category = resolved.category ?? "all";
  const sort = resolved.sort ?? "featured";
  const { settings, items, categories } = await listCourses(resolved);

  const categoryOptions = [{ label: "Tất cả danh mục", value: "all" }, ...categories.map((item) => ({ label: item, value: item }))];
  const sortOptions = [
    { label: "Nổi bật", value: "featured" },
    { label: "Tên A-Z", value: "title" },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageIntro
        eyebrow="Khóa học"
        title="Khóa học theo từng môn trọng tâm"
        description="Xem nhanh khóa học theo môn, nắm rõ nội dung chính và mở form đăng ký khi cần tư vấn thêm."
        badges={["Giải tích", "Đại số tuyến tính", "NMLT / OOP / DSA", "Mạng / CSDL / Hệ điều hành"]}
      />

      <CatalogToolbar
        action="/khoa-hoc"
        q={resolved.q}
        category={category}
        sort={sort}
        categories={categoryOptions}
        sorts={sortOptions}
      />

      {items.length ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((course) => (
            <CatalogCard
              key={course.slug}
              title={course.title}
              description={course.shortDescription}
              href={`/khoa-hoc/${course.slug}`}
              badge={`${course.category} • ${course.level}`}
              meta={[course.duration, course.format, course.priceLabel]}
              price={course.priceLabel}
              accent="cyan"
            />
          ))}
        </div>
      ) : (
        <div className="surface-panel rounded-[2rem] px-6 py-10 text-center">
          <p className="text-2xl font-semibold text-slate-950">Chưa có kết quả phù hợp</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-black/62">
            Thử đổi từ khóa hoặc chọn lại danh mục để xem thêm khóa học khác.
          </p>
        </div>
      )}

      <div className="surface-panel flex flex-col gap-4 rounded-[2rem] px-6 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">Đăng ký nhanh</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">Mở form để UIT Knowledge liên hệ tư vấn khóa học phù hợp.</p>
        </div>
        <Button className="w-fit rounded-full bg-black text-white hover:bg-black/90" asChild>
          <Link
            href={buildTrackedCtaHref({
              targetType: "COURSE",
              targetUrl: settings.courseFormUrl,
              source: "course-list-inline",
              targetLabel: "Đăng ký ngay",
            })}
            target="_blank"
            rel="noreferrer"
          >
            Đăng ký ngay
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <CtaBand
        title="Muốn xem thêm video ôn tập theo môn?"
        description="Bạn có thể chuyển sang trang video hoặc liên hệ trực tiếp để hỏi nhanh phần nội dung đang cần."
        primaryHref="/video"
        primaryLabel="Xem video"
        secondaryHref="/lien-he"
        secondaryLabel="Liên hệ"
      />
    </main>
  );
}
