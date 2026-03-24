import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayCircle, Youtube } from "lucide-react";
import { CtaBand } from "@/components/public/cta-band";
import { SectionHeading } from "@/components/public/section-heading";
import { YoutubeEmbed } from "@/components/public/youtube-embed";
import { Button } from "@/components/ui/button";
import { getVideoBySlug } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) return { title: "Video không tồn tại" };

  return {
    title: video.title,
    description: video.shortDescription,
  };
}

export default async function VideoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) notFound();

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="eyebrow-label">Video YouTube</p>
            <h1 className="text-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-pretty text-slate-950 sm:text-5xl sm:leading-[1.02]">
              {video.title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-black/65">{video.longDescription}</p>
          </div>

          <YoutubeEmbed youtubeId={video.youtubeId} title={video.title} />

          <div className="surface-card rounded-[2rem] px-6 py-6">
            <div className="space-y-4">
              <SectionHeading eyebrow="Nội dung" title="Vì sao nên xem?" />
              <p className="text-sm leading-7 text-black/65">
                Video này phù hợp để nắm nhanh chủ đề trước khi học sâu hơn hoặc chuyển sang khóa học liên quan.
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="surface-card rounded-[2rem] px-6 py-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-black/45">
                <Youtube className="size-4 text-red-500" />
                Thông tin video
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-semibold text-slate-950">{video.duration}</p>
                <p className="text-sm leading-7 text-black/60">{video.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="rounded-full border-black/10 bg-white" asChild>
                  <Link href="/video">Xem thêm video</Link>
                </Button>
                <Button className="rounded-full bg-black text-white hover:bg-black/90" asChild>
                  <Link href="/khoa-hoc">
                    Xem khóa học
                    <PlayCircle className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="surface-card rounded-[2rem] px-6 py-6">
            <div className="space-y-4">
              <p className="text-sm font-medium text-black/48">Tags</p>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-black/5 px-3 py-1.5 text-xs text-black/66">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </section>

      <CtaBand
        title="Xem thêm khóa học hoặc merch."
        description="Chuyển tiếp sang nội dung phù hợp với nhu cầu của bạn."
        primaryHref="/khoa-hoc"
        primaryLabel="Xem khóa học"
        secondaryHref="/merch"
        secondaryLabel="Xem merch"
      />
    </main>
  );
}
