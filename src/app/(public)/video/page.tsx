import type { Metadata } from "next";
import { CatalogToolbar } from "@/components/public/catalog-toolbar";
import { PageIntro } from "@/components/public/page-intro";
import { VideoCard } from "@/components/public/video-card";
import { listVideos } from "@/lib/site";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  sort?: string;
};

export const metadata: Metadata = {
  title: "Video",
  description: "Danh sách video ôn tập và hệ thống kiến thức của UIT Knowledge.",
};

export default async function VideosPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolved = await searchParams;
  const sort = resolved.sort ?? "featured";
  const { items } = await listVideos(resolved);

  const sortOptions = [
    { label: "Nổi bật", value: "featured" },
    { label: "A-Z", value: "title" },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageIntro
        eyebrow="Video"
        title="Video ôn tập để xem nhanh trước khi học sâu hơn"
        description="Các video được sắp để bạn dễ tra cứu theo môn, xem nhanh trước giờ học hoặc trước kỳ kiểm tra."
        badges={["Xem nhanh", "Ôn giữa kỳ", "Ôn cuối kỳ", "Theo từng môn"]}
      />

      <CatalogToolbar
        action="/video"
        q={resolved.q}
        sort={sort}
        category="all"
        categories={[{ label: "Tất cả", value: "all" }]}
        sorts={sortOptions}
      />

      {items.length ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((video) => (
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
      ) : (
        <div className="surface-panel rounded-[2rem] px-6 py-10 text-center">
          <p className="text-2xl font-semibold text-slate-950">Chưa có video phù hợp</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-black/62">
            Bạn có thể thử đổi từ khóa để tìm lại video theo môn hoặc chủ đề đang cần.
          </p>
        </div>
      )}
    </main>
  );
}
