import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { joinLines, parseBoolean, parseNumber, slugify, splitLines } from "@/lib/admin-utils";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function saveCourse(formData: FormData) {
  "use server";

  await requireAdmin();

  const originalSlug = String(formData.get("originalSlug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
  const payload = {
    title,
    slug,
    category: String(formData.get("category") ?? "").trim(),
    level: String(formData.get("level") ?? "").trim(),
    format: String(formData.get("format") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    longDescription: String(formData.get("longDescription") ?? "").trim(),
    targetAudience: String(formData.get("targetAudience") ?? "").trim() || null,
    outline: String(formData.get("outline") ?? "").trim() || null,
    featuredPoints: splitLines(formData.get("featuredPoints")),
    priceLabel: String(formData.get("priceLabel") ?? "").trim(),
    originalPriceLabel: String(formData.get("originalPriceLabel") ?? "").trim() || null,
    durationLabel: String(formData.get("durationLabel") ?? "").trim() || null,
    status: String(formData.get("status") ?? "PUBLISHED") as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    featured: parseBoolean(formData.get("featured")),
    sortOrder: parseNumber(formData.get("sortOrder")),
    coverImageUrl: String(formData.get("coverImageUrl") ?? "").trim() || null,
    coverImageAlt: String(formData.get("coverImageAlt") ?? "").trim() || null,
    ctaUrlOverride: String(formData.get("ctaUrlOverride") ?? "").trim() || null,
    tags: splitLines(formData.get("tags")),
  };

  if (originalSlug) {
    await prisma.course.update({ where: { slug: originalSlug }, data: payload });
  } else {
    await prisma.course.create({ data: payload });
  }

  revalidatePath("/admin/courses");
  revalidatePath("/");
  redirect("/admin/courses");
}

async function deleteCourse(formData: FormData) {
  "use server";

  await requireAdmin();

  await prisma.course.delete({
    where: { slug: String(formData.get("slug") ?? "") },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/");
  redirect("/admin/courses");
}

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams?: Promise<{ edit?: string }>;
}) {
  const params = await searchParams;
  const [courses, editing] = await Promise.all([
    prisma.course.findMany({
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { title: "asc" }],
    }),
    params?.edit ? prisma.course.findUnique({ where: { slug: params.edit } }) : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Khóa học"
        title="Quản lý khóa học"
        description="Tạo, sửa và ẩn khóa học hoặc lộ trình cho trang public. Outline, tag và CTA đều được lưu ngay trong CMS."
        badge={`${courses.length} mục`}
      />

      <Card className="border-black/10 bg-white/90 shadow-sm">
        <CardContent className="p-6">
          <form action={saveCourse} className="grid gap-5">
            <input type="hidden" name="originalSlug" defaultValue={editing?.slug ?? ""} />
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Tên khóa học</Label>
                <Input id="title" name="title" defaultValue={editing?.title ?? ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" defaultValue={editing?.slug ?? ""} placeholder="tự tạo từ tiêu đề nếu để trống" />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục</Label>
                <Input id="category" name="category" defaultValue={editing?.category ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Trình độ</Label>
                <Input id="level" name="level" defaultValue={editing?.level ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">Hình thức</Label>
                <Input id="format" name="format" defaultValue={editing?.format ?? ""} />
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
                <Label htmlFor="targetAudience">Đối tượng phù hợp</Label>
                <Textarea id="targetAudience" name="targetAudience" rows={3} defaultValue={editing?.targetAudience ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outline">Outline</Label>
                <Textarea id="outline" name="outline" rows={3} defaultValue={editing?.outline ?? ""} />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="featuredPoints">Điểm nổi bật</Label>
                <Textarea id="featuredPoints" name="featuredPoints" rows={4} defaultValue={joinLines(editing?.featuredPoints ?? [])} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Thẻ tag</Label>
                <Textarea id="tags" name="tags" rows={4} defaultValue={joinLines(editing?.tags ?? [])} />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="priceLabel">Nhãn giá</Label>
                <Input id="priceLabel" name="priceLabel" defaultValue={editing?.priceLabel ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPriceLabel">Giá gốc</Label>
                <Input id="originalPriceLabel" name="originalPriceLabel" defaultValue={editing?.originalPriceLabel ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationLabel">Thời lượng</Label>
                <Input id="durationLabel" name="durationLabel" defaultValue={editing?.durationLabel ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Thứ tự hiển thị</Label>
                <Input id="sortOrder" name="sortOrder" type="number" defaultValue={editing?.sortOrder ?? 0} />
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
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3">
                <input type="checkbox" name="featured" defaultChecked={editing?.featured ?? false} className="size-4 rounded border-black/20" />
                <span className="text-sm font-medium">Đánh dấu nổi bật</span>
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3">
                <span className="text-sm font-medium">Trạng thái</span>
                <select
                  name="status"
                  defaultValue={editing?.status ?? "PUBLISHED"}
                  className="ml-auto rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                >
                  <option value="DRAFT">Bản nháp</option>
                  <option value="PUBLISHED">Đang hiển thị</option>
                  <option value="ARCHIVED">Lưu trữ</option>
                </select>
              </label>
            </div>
            <Button type="submit" className="w-fit rounded-full bg-black text-white hover:bg-black/90">
              {editing ? "Cập nhật khóa học" : "Tạo khóa học"}
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
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.slug}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>{course.priceLabel}</TableCell>
                  <TableCell>{course.status}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="rounded-full bg-white">
                        <a href={`/admin/courses?edit=${course.slug}`}>Sửa</a>
                      </Button>
                      <form action={deleteCourse}>
                        <input type="hidden" name="slug" value={course.slug} />
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
