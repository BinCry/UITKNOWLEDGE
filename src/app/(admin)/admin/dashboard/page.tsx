import { prisma } from "@/lib/prisma";
import { SITE_SETTINGS_ID } from "@/lib/constants";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const [setting, coursesCount, productsCount, videosCount, testimonialsCount, faqCount, mediaCount, clickCount, recentClicks] =
    await Promise.all([
      prisma.siteSetting.findUnique({ where: { id: SITE_SETTINGS_ID } }),
      prisma.course.count(),
      prisma.product.count(),
      prisma.video.count(),
      prisma.testimonial.count(),
      prisma.faq.count(),
      prisma.mediaAsset.count(),
      prisma.ctaClickEvent.count(),
      prisma.ctaClickEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Tổng quan"
        title="Bảng điều khiển UIT Knowledge"
        description="Theo dõi nhanh số lượng nội dung, lượt mở biểu mẫu và các liên kết đang hoạt động trên website."
        badge={setting?.brandShortName ?? "UIT"}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Khóa học" value={String(coursesCount)} note="Lộ trình và nội dung đang hiển thị" />
        <StatCard label="Merch" value={String(productsCount)} note="Sản phẩm và phụ kiện" />
        <StatCard label="Video" value={String(videosCount)} note="Video YouTube nổi bật" />
        <StatCard label="Biểu mẫu" value={String(clickCount)} note="Tổng số lượt mở Google Form" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <StatCard label="Cảm nhận" value={String(testimonialsCount)} note="Nội dung tăng độ tin cậy" />
        <StatCard label="Câu hỏi thường gặp" value={String(faqCount)} note="Giải đáp nhanh cho người xem" />
        <StatCard label="Thư viện ảnh" value={String(mediaCount)} note="Tài nguyên đã lưu trên hệ thống" />
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-black/10 bg-white/90 shadow-sm">
          <CardContent className="min-w-0 space-y-4 p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">Lượt mở gần đây</p>
                <h2 className="mt-1 text-xl font-semibold">Liên kết được mở mới nhất</h2>
              </div>
              <Badge variant="secondary" className="rounded-full">
                Đang hoạt động
              </Badge>
            </div>

            <div className="grid min-w-0 gap-3">
              {recentClicks.map((item) => (
                <div key={item.id} className="min-w-0 rounded-2xl border border-black/10 bg-white px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                    <span>{item.targetLabel ?? item.targetType}</span>
                    <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-black/50">{item.source ?? "unknown"}</span>
                  </div>
                  <p className="mt-1 text-sm text-black/55 break-words [overflow-wrap:anywhere]">{item.targetUrl}</p>
                </div>
              ))}

              {!recentClicks.length ? <p className="text-sm text-black/55">Chưa có lượt mở nào.</p> : null}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-slate-800/75 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-sm">
          <CardContent className="space-y-4 p-4 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">Tình trạng thương hiệu</p>
            <h2 className="text-2xl font-semibold">{setting?.brandName ?? "UIT Knowledge"}</h2>
            <p className="text-sm leading-7 text-white/70">{setting?.heroDescription}</p>

            <div className="grid gap-3">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Biểu mẫu khóa học</p>
                <p className="mt-2 text-sm leading-6 text-white/84 break-words [overflow-wrap:anywhere]">{setting?.courseFormUrl}</p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Biểu mẫu merch</p>
                <p className="mt-2 text-sm leading-6 text-white/84 break-words [overflow-wrap:anywhere]">{setting?.merchFormUrl}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
