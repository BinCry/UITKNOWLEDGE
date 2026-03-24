import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Quote, ShieldCheck } from "lucide-react";
import { CatalogCard } from "@/components/public/catalog-card";
import { CtaBand } from "@/components/public/cta-band";
import { Hero } from "@/components/public/hero";
import { SectionHeading } from "@/components/public/section-heading";
import { VideoCard } from "@/components/public/video-card";
import { Button } from "@/components/ui/button";
import { getHomePageData } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "UIT Knowledge tổng hợp video, khóa học và tài nguyên học tập cho các môn trọng tâm tại UIT.",
};

export default async function HomePage() {
  const { settings, highlightStats, pillars, courses, products, videos, testimonials, faqs } = await getHomePageData();

  return (
    <main className="space-y-14 pb-14">
      <Hero
        brandName={settings.brandName}
        slogan={settings.slogan}
        heroTitle={settings.heroTitle}
        heroDescription={settings.heroDescription}
        heroBadge={settings.heroBadge}
        facebookUrl={settings.facebookUrl}
      />

      <section className="mx-auto -mt-6 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {highlightStats.map((item) => (
            <div key={item.label} className="surface-card rounded-[1.8rem] px-6 py-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{item.value}</p>
              <p className="mt-1 text-sm leading-7 text-black/60">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-panel mesh-panel rounded-[2rem] px-6 py-7 sm:px-8 sm:py-8">
            <SectionHeading eyebrow="Định vị nội dung" title={settings.introTitle} description={settings.introDescription} />
            <div className="mt-6 space-y-4 text-sm leading-7 text-black/64">
              <div className="surface-card rounded-[1.5rem] bg-[#fbfbf8] p-4">
                Nội dung được chia theo từng môn để bạn chọn đúng chủ đề đang cần xem, tránh mất thời gian tìm lại trong nhiều nguồn rời rạc.
              </div>
              <div className="surface-card rounded-[1.5rem] bg-[#fbfbf8] p-4">
                Video hỗ trợ xem nhanh; khóa học đi theo lộ trình rõ ràng; merch được tách riêng để khu vực học tập luôn gọn và tập trung.
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {["Giải tích", "Đại số tuyến tính", "NMLT", "OOP", "DSA", "Mạng máy tính", "CSDL", "Hệ điều hành"].map((item) => (
                  <span key={item} className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm text-black/66">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {pillars.map((item, index) => (
              <div key={item.title} className="surface-card rounded-[1.8rem] px-6 py-6">
                <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-black text-sm font-semibold text-white">
                    0{index + 1}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-display text-2xl font-semibold text-slate-950">{item.title}</h3>
                    <p className="text-sm leading-7 text-black/62">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {settings.showFeaturedVideos ? (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Video"
              title="Video ôn tập nổi bật"
              description="Các video được chọn theo hướng dễ xem nhanh, đúng trọng tâm và phù hợp khi bạn cần ôn lại một chủ đề cụ thể."
            />
            <Button variant="outline" className="w-fit rounded-full border-black/10 bg-white/88" asChild>
              <Link href="/video">
                Xem tất cả video
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard
                key={video.slug}
                title={video.title}
                description={video.shortDescription}
                youtubeId={video.youtubeId}
                duration={video.duration}
                href={`/video/${video.slug}`}
                featured={video.featured}
              />
            ))}
          </div>
        </section>
      ) : null}

      {settings.showFeaturedCourses ? (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Khóa học"
              title="Khóa học theo từng môn"
              description="Mỗi khóa học đều ghi rõ trọng tâm, đối tượng phù hợp và cách đăng ký để bạn chọn nhanh phần mình cần."
            />
            <Button variant="outline" className="w-fit rounded-full border-black/10 bg-white/88" asChild>
              <Link href="/khoa-hoc">
                Xem tất cả khóa học
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {courses.map((course) => (
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
        </section>
      ) : null}

      {settings.showFeaturedProducts ? (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Merch"
              title="Merch cho cộng đồng UIT Knowledge"
              description="Một số sản phẩm nhận diện dành cho người theo dõi kênh, được tách riêng để khu vực nội dung học vẫn là trọng tâm."
            />
            <Button variant="outline" className="w-fit rounded-full border-black/10 bg-white/88" asChild>
              <Link href="/merch">
                Xem tất cả merch
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {products.map((product) => (
              <CatalogCard
                key={product.slug}
                title={product.title}
                description={product.shortDescription}
                href={`/merch/${product.slug}`}
                badge={`${product.category} • ${product.availability}`}
                meta={[product.material, product.variantText, product.priceLabel]}
                price={product.priceLabel}
                accent="amber"
              />
            ))}
          </div>
        </section>
      ) : null}

      {settings.showTestimonials && testimonials.length ? (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Phản hồi"
            title="Người học nhận được gì từ nội dung"
            description="Một vài phản hồi ngắn từ người học và người theo dõi kênh sau khi sử dụng nội dung của UIT Knowledge."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.id} className="surface-card rounded-[2rem] px-6 py-6">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <Quote className="size-6 text-cyan-500" />
                    {item.courseLabel ? (
                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
                        {item.courseLabel}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm leading-7 text-black/64">{item.quote}</p>
                  <div>
                    <p className="font-semibold text-slate-950">{item.name}</p>
                    <p className="text-sm text-black/50">{item.roleLabel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {settings.showFaq && faqs.length ? (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Câu hỏi thường gặp"
            title="Những thông tin cần biết trước khi đăng ký"
            description="Tóm tắt nhanh để bạn nắm cách dùng web, đăng ký khóa học và mua merch."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {faqs.map((item) => (
              <div key={item.id} className="surface-card rounded-[1.8rem] px-6 py-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-black/62">
                    <ShieldCheck className="size-3.5" />
                    {item.category}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-950">{item.question}</h3>
                  <p className="text-sm leading-7 text-black/62">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <CtaBand
          title="Bắt đầu từ video ôn tập hoặc khóa học theo đúng môn bạn đang cần."
          description="Nếu chưa chắc nên xem gì trước, bạn có thể vào thẳng trang video hoặc khóa học để chọn phần phù hợp."
          primaryHref="/khoa-hoc"
          primaryLabel="Xem khóa học"
          secondaryHref="/video"
          secondaryLabel="Xem video"
        />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="surface-panel flex flex-col gap-5 rounded-[2rem] px-6 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">Liên hệ</p>
            <p className="max-w-2xl text-2xl font-semibold text-slate-950">
              Cần hỏi thêm về môn học, lộ trình ôn tập hoặc đăng ký khóa học?
            </p>
            <p className="text-sm leading-7 text-black/62">
              Bạn có thể nhắn qua Facebook, Zalo hoặc email để được hướng dẫn nhanh hơn.
            </p>
          </div>
          <Button className="w-fit rounded-full bg-black px-6 text-white hover:bg-black/90" asChild>
            <Link href="/lien-he">
              Xem liên hệ
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
