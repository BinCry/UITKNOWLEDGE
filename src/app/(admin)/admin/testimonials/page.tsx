import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parseBoolean, parseNumber } from "@/lib/admin-utils";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function saveTestimonial(formData: FormData) {
  "use server";

  await requireAdmin();

  const originalId = String(formData.get("originalId") ?? "");
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    roleLabel: String(formData.get("roleLabel") ?? "").trim(),
    quote: String(formData.get("quote") ?? "").trim(),
    courseLabel: String(formData.get("courseLabel") ?? "").trim() || null,
    avatarUrl: String(formData.get("avatarUrl") ?? "").trim() || null,
    featured: parseBoolean(formData.get("featured")),
    sortOrder: parseNumber(formData.get("sortOrder")),
  };

  if (originalId) {
    await prisma.testimonial.update({ where: { id: originalId }, data: payload });
  } else {
    await prisma.testimonial.create({ data: payload });
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

async function deleteTestimonial(formData: FormData) {
  "use server";
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id: String(formData.get("id") ?? "") } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export default async function AdminTestimonialsPage({ searchParams }: { searchParams?: Promise<{ edit?: string }> }) {
  const params = await searchParams;
  const [items, editing] = await Promise.all([
    prisma.testimonial.findMany({ orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }] }),
    params?.edit ? prisma.testimonial.findUnique({ where: { id: params.edit } }) : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Cảm nhận"
        title="Quản lý phản hồi"
        description="Thêm, sửa và xóa các cảm nhận để tăng độ tin cậy cho landing page."
        badge={`${items.length} mục`}
      />

      <Card className="border-black/10 bg-white/90 shadow-sm">
        <CardContent className="p-6">
          <form action={saveTestimonial} className="grid gap-5">
            <input type="hidden" name="originalId" defaultValue={editing?.id ?? ""} />
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Tên người gửi</Label>
                <Input id="name" name="name" defaultValue={editing?.name ?? ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleLabel">Vai trò</Label>
                <Input id="roleLabel" name="roleLabel" defaultValue={editing?.roleLabel ?? ""} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote">Nội dung cảm nhận</Label>
              <Textarea id="quote" name="quote" rows={4} defaultValue={editing?.quote ?? ""} />
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="courseLabel">Khóa học liên quan</Label>
                <Input id="courseLabel" name="courseLabel" defaultValue={editing?.courseLabel ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Link ảnh đại diện</Label>
                <Input id="avatarUrl" name="avatarUrl" defaultValue={editing?.avatarUrl ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Thứ tự hiển thị</Label>
                <Input id="sortOrder" name="sortOrder" type="number" defaultValue={editing?.sortOrder ?? 0} />
              </div>
            </div>
            <label className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3">
              <input type="checkbox" name="featured" defaultChecked={editing?.featured ?? false} className="size-4 rounded border-black/20" />
              <span className="text-sm font-medium">Đánh dấu nổi bật</span>
            </label>
            <Button type="submit" className="w-fit rounded-full bg-black text-white hover:bg-black/90">
              {editing ? "Cập nhật cảm nhận" : "Tạo cảm nhận"}
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
                <TableHead>Vai trò</TableHead>
                <TableHead>Nổi bật</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.roleLabel}</TableCell>
                  <TableCell>{item.featured ? "Có" : "Không"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="rounded-full bg-white">
                        <a href={`/admin/testimonials?edit=${item.id}`}>Sửa</a>
                      </Button>
                      <form action={deleteTestimonial}>
                        <input type="hidden" name="id" value={item.id} />
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
