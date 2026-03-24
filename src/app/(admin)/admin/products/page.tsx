import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { currencyLabel, joinLines, parseBoolean, parseMaybeNumber, parseNumber, slugify, splitLines } from "@/lib/admin-utils";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function saveProduct(formData: FormData) {
  "use server";

  await requireAdmin();

  const originalSlug = String(formData.get("originalSlug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
  const compareAtRaw = parseMaybeNumber(formData.get("compareAtPrice"));
  const payload = {
    title,
    slug,
    category: String(formData.get("category") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    longDescription: String(formData.get("longDescription") ?? "").trim(),
    material: String(formData.get("material") ?? "").trim() || null,
    variantText: String(formData.get("variantText") ?? "").trim() || null,
    price: new Prisma.Decimal(String(formData.get("price") ?? "0").trim() || "0"),
    compareAtPrice: compareAtRaw === null ? null : new Prisma.Decimal(String(compareAtRaw)),
    availabilityStatus: String(formData.get("availabilityStatus") ?? "IN_STOCK") as "IN_STOCK" | "LIMITED" | "SOLD_OUT",
    featured: parseBoolean(formData.get("featured")),
    sortOrder: parseNumber(formData.get("sortOrder")),
    coverImageUrl: String(formData.get("coverImageUrl") ?? "").trim() || null,
    coverImageAlt: String(formData.get("coverImageAlt") ?? "").trim() || null,
    galleryUrls: splitLines(formData.get("galleryUrls")),
    ctaUrlOverride: String(formData.get("ctaUrlOverride") ?? "").trim() || null,
    tags: splitLines(formData.get("tags")),
  };

  if (originalSlug) {
    await prisma.product.update({ where: { slug: originalSlug }, data: payload });
  } else {
    await prisma.product.create({ data: payload });
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

async function deleteProduct(formData: FormData) {
  "use server";

  await requireAdmin();

  await prisma.product.delete({ where: { slug: String(formData.get("slug") ?? "") } });
  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export default async function AdminProductsPage({ searchParams }: { searchParams?: Promise<{ edit?: string }> }) {
  const params = await searchParams;
  const [products, editing] = await Promise.all([
    prisma.product.findMany({
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { title: "asc" }],
    }),
    params?.edit ? prisma.product.findUnique({ where: { slug: params.edit } }) : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Merch"
        title="Quản lý merch"
        description="Tại đây bạn lưu áo, móc khóa, dây đeo và các sản phẩm phụ kiện khác của thương hiệu."
        badge={`${products.length} mục`}
      />
      <Card className="border-black/10 bg-white/90 shadow-sm">
        <CardContent className="p-6">
          <form action={saveProduct} className="grid gap-5">
            <input type="hidden" name="originalSlug" defaultValue={editing?.slug ?? ""} />
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Tên sản phẩm</Label>
                <Input id="title" name="title" defaultValue={editing?.title ?? ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" defaultValue={editing?.slug ?? ""} />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục</Label>
                <Input id="category" name="category" defaultValue={editing?.category ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material">Chất liệu</Label>
                <Input id="material" name="material" defaultValue={editing?.material ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="variantText">Biến thể</Label>
                <Input id="variantText" name="variantText" defaultValue={editing?.variantText ?? ""} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Mô tả ngắn</Label>
              <Textarea id="shortDescription" name="shortDescription" rows={3} defaultValue={editing?.shortDescription ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longDescription">Mô tả chi tiết</Label>
              <Textarea id="longDescription" name="longDescription" rows={5} defaultValue={editing?.longDescription ?? ""} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="galleryUrls">Danh sách ảnh</Label>
                <Textarea id="galleryUrls" name="galleryUrls" rows={4} defaultValue={joinLines(editing?.galleryUrls ?? [])} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Thẻ tag</Label>
                <Textarea id="tags" name="tags" rows={4} defaultValue={joinLines(editing?.tags ?? [])} />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="price">Giá bán</Label>
                <Input id="price" name="price" defaultValue={editing?.price.toString() ?? "0"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compareAtPrice">Giá so sánh</Label>
                <Input id="compareAtPrice" name="compareAtPrice" defaultValue={editing?.compareAtPrice?.toString() ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Thứ tự hiển thị</Label>
                <Input id="sortOrder" name="sortOrder" type="number" defaultValue={editing?.sortOrder ?? 0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availabilityStatus">Tình trạng hàng</Label>
                <select
                  id="availabilityStatus"
                  name="availabilityStatus"
                  defaultValue={editing?.availabilityStatus ?? "IN_STOCK"}
                  className="h-9 w-full rounded-md border border-black/10 bg-white px-3 text-sm"
                >
                  <option value="IN_STOCK">Còn hàng</option>
                  <option value="LIMITED">Sắp hết</option>
                  <option value="SOLD_OUT">Hết hàng</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="coverImageUrl">Link ảnh bìa</Label>
                <Input id="coverImageUrl" name="coverImageUrl" defaultValue={editing?.coverImageUrl ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverImageAlt">Mô tả ảnh bìa</Label>
                <Input id="coverImageAlt" name="coverImageAlt" defaultValue={editing?.coverImageAlt ?? ""} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaUrlOverride">Ghi đè link CTA</Label>
              <Input id="ctaUrlOverride" name="ctaUrlOverride" defaultValue={editing?.ctaUrlOverride ?? ""} />
            </div>
            <label className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3">
              <input type="checkbox" name="featured" defaultChecked={editing?.featured ?? false} className="size-4 rounded border-black/20" />
              <span className="text-sm font-medium">Đánh dấu nổi bật</span>
            </label>
            <Button type="submit" className="w-fit rounded-full bg-black text-white hover:bg-black/90">
              {editing ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-black/10 bg-white/90 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Tình trạng</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.slug}>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{currencyLabel(product.price.toString())}</TableCell>
                  <TableCell>{product.availabilityStatus}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="rounded-full bg-white">
                        <a href={`/admin/products?edit=${product.slug}`}>Sửa</a>
                      </Button>
                      <form action={deleteProduct}>
                        <input type="hidden" name="slug" value={product.slug} />
                        <Button variant="outline" size="sm" className="rounded-full border-red-200 bg-white text-red-600">
                          Xóa
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
