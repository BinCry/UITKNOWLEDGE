import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CatalogCard } from "@/components/public/catalog-card";
import { CatalogToolbar } from "@/components/public/catalog-toolbar";
import { CtaBand } from "@/components/public/cta-band";
import { PageIntro } from "@/components/public/page-intro";
import { Button } from "@/components/ui/button";
import { buildTrackedCtaHref } from "@/lib/cta";
import { listProducts } from "@/lib/site";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  category?: string;
  sort?: string;
};

export const metadata: Metadata = {
  title: "Merch",
  description: "Danh sách merch UIT Knowledge.",
};

export default async function MerchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolved = await searchParams;
  const category = resolved.category ?? "all";
  const sort = resolved.sort ?? "featured";
  const { settings, items, categories } = await listProducts(resolved);

  const categoryOptions = [{ label: "Tất cả", value: "all" }, ...categories.map((item) => ({ label: item, value: item }))];
  const sortOptions = [
    { label: "Nổi bật", value: "featured" },
    { label: "Giá tăng dần", value: "price-asc" },
    { label: "Giá giảm dần", value: "price-desc" },
    { label: "Tên A-Z", value: "title" },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageIntro
        eyebrow="Merch"
        title="Merch dành cho cộng đồng UIT Knowledge"
        description="Xem nhanh giá, chất liệu và biến thể của từng sản phẩm trước khi mở form đặt hàng."
        badges={["Áo", "Móc khóa", "Badge", "Dây đeo"]}
      />

      <CatalogToolbar
        action="/merch"
        q={resolved.q}
        category={category}
        sort={sort}
        categories={categoryOptions}
        sorts={sortOptions}
      />

      {items.length ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((product) => (
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
      ) : (
        <div className="surface-panel rounded-[2rem] px-6 py-10 text-center">
          <p className="text-2xl font-semibold text-slate-950">Chưa có sản phẩm phù hợp</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-black/62">
            Thử thay từ khóa hoặc bỏ bộ lọc để xem thêm các sản phẩm merch khác.
          </p>
        </div>
      )}

      <div className="surface-panel flex flex-col gap-4 rounded-[2rem] px-6 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">Mua merch</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">Mở form đặt hàng để xác nhận mẫu, biến thể và thông tin nhận hàng.</p>
        </div>
        <Button className="w-fit rounded-full bg-black text-white hover:bg-black/90" asChild>
          <Link
            href={buildTrackedCtaHref({
              targetType: "PRODUCT",
              targetUrl: settings.merchFormUrl,
              source: "product-list-inline",
              targetLabel: "Mua merch",
            })}
            target="_blank"
            rel="noreferrer"
          >
            Mua merch
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <CtaBand
        title="Muốn quay lại phần nội dung học tập?"
        description="Bạn có thể xem video hoặc khóa học ngay từ đây mà không cần quay về trang chủ."
        primaryHref="/video"
        primaryLabel="Xem video"
        secondaryHref="/khoa-hoc"
        secondaryLabel="Xem khóa học"
      />
    </main>
  );
}
