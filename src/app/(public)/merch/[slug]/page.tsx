/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, Shirt } from "lucide-react";
import { CtaBand } from "@/components/public/cta-band";
import { SectionHeading } from "@/components/public/section-heading";
import { Button } from "@/components/ui/button";
import { buildTrackedCtaHref } from "@/lib/cta";
import { getProductBySlug } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Sản phẩm không tồn tại" };

  return {
    title: product.title,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6">
          <div className="surface-panel rounded-[2rem] p-6">
            <div className="aspect-square overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-black via-zinc-900 to-neutral-800 p-4">
              <img src={product.gallery[0]} alt={product.title} className="h-full w-full rounded-[1.25rem] object-cover opacity-90" />
            </div>
          </div>

          {product.gallery.length > 1 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {product.gallery.slice(1).map((item, index) => (
                <div key={`${item}-${index}`} className="surface-card rounded-[1.5rem] p-3">
                  <img src={item} alt={product.title} className="aspect-square w-full rounded-xl object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <aside className="space-y-6">
          <div className="space-y-3">
            <p className="eyebrow-label">Merch</p>
            <h1 className="text-display text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-pretty text-slate-950 sm:text-5xl sm:leading-[1.02]">{product.title}</h1>
            <p className="max-w-2xl text-lg leading-8 text-black/65">{product.longDescription}</p>
          </div>

          <div className="surface-card rounded-[2rem] px-6 py-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-black/45">
                <Shirt className="size-4" />
                Thông tin sản phẩm
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-semibold text-slate-950">{product.priceLabel}</p>
                {product.originalPriceLabel ? <p className="text-sm text-black/45 line-through">{product.originalPriceLabel}</p> : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/65">{product.category}</span>
                <span className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/65">{product.availability}</span>
              </div>
              <p className="text-sm leading-7 text-black/60">Chất liệu: {product.material}</p>
              <p className="text-sm leading-7 text-black/60">Biến thể: {product.variantText}</p>
              <Button className="w-full rounded-full bg-black text-white hover:bg-black/90" asChild>
                <Link
                  href={buildTrackedCtaHref({
                    targetType: "PRODUCT",
                    targetUrl: product.ctaHref,
                    source: "product-detail",
                    targetId: product.id,
                    targetLabel: product.title,
                  })}
                  target="_blank"
                  rel="noreferrer"
                >
                  Mua merch
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <p className="text-sm leading-7 text-black/55">Form mua merch sẽ mở để bên mình xác nhận đơn nhanh hơn.</p>
            </div>
          </div>

          <div className="surface-card rounded-[2rem] px-6 py-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-black/45">
                <BadgeCheck className="size-4" />
                Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/65">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="space-y-6">
        <SectionHeading eyebrow="Gợi ý" title="Xem thêm nội dung liên quan" />
        <CtaBand
          title="Muốn xem thêm video hoặc khóa học?"
          description="Chuyển nhanh sang phần nội dung bạn đang quan tâm."
          primaryHref="/video"
          primaryLabel="Xem video"
          secondaryHref="/khoa-hoc"
          secondaryLabel="Xem khóa học"
        />
      </div>
    </main>
  );
}
