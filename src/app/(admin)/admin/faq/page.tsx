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

async function saveFaq(formData: FormData) {
  "use server";

  await requireAdmin();

  const originalId = String(formData.get("originalId") ?? "");
  const payload = {
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    featured: parseBoolean(formData.get("featured")),
    sortOrder: parseNumber(formData.get("sortOrder")),
  };

  if (originalId) {
    await prisma.faq.update({ where: { id: originalId }, data: payload });
  } else {
    await prisma.faq.create({ data: payload });
  }

  revalidatePath("/admin/faq");
  revalidatePath("/");
  redirect("/admin/faq");
}

async function deleteFaq(formData: FormData) {
  "use server";
  await requireAdmin();
  await prisma.faq.delete({ where: { id: String(formData.get("id") ?? "") } });
  revalidatePath("/admin/faq");
  revalidatePath("/");
  redirect("/admin/faq");
}

export default async function AdminFaqPage({ searchParams }: { searchParams?: Promise<{ edit?: string }> }) {
  const params = await searchParams;
  const [items, editing] = await Promise.all([
    prisma.faq.findMany({ orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { question: "asc" }] }),
    params?.edit ? prisma.faq.findUnique({ where: { id: params.edit } }) : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="FAQ"
        title="Quản lý câu hỏi thường gặp"
        description="Chọn các câu hỏi cần hiển thị trên homepage để người xem nắm nhanh thông tin trước khi bấm CTA."
        badge={`${items.length} mục`}
      />

      <Card className="border-black/10 bg-white/90 shadow-sm">
        <CardContent className="p-6">
          <form action={saveFaq} className="grid gap-5">
            <input type="hidden" name="originalId" defaultValue={editing?.id ?? ""} />
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="question">Câu hỏi</Label>
                <Input id="question" name="question" defaultValue={editing?.question ?? ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục</Label>
                <Input id="category" name="category" defaultValue={editing?.category ?? ""} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Câu trả lời</Label>
              <Textarea id="answer" name="answer" rows={5} defaultValue={editing?.answer ?? ""} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Thứ tự hiển thị</Label>
                <Input id="sortOrder" name="sortOrder" type="number" defaultValue={editing?.sortOrder ?? 0} />
              </div>
              <label className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3">
                <input type="checkbox" name="featured" defaultChecked={editing?.featured ?? false} className="size-4 rounded border-black/20" />
                <span className="text-sm font-medium">Đánh dấu nổi bật</span>
              </label>
            </div>
            <Button type="submit" className="w-fit rounded-full bg-black text-white hover:bg-black/90">
              {editing ? "Cập nhật FAQ" : "Tạo FAQ"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-black/10 bg-white/90 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Câu hỏi</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Nổi bật</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.question}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.featured ? "Có" : "Không"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="rounded-full bg-white">
                        <a href={`/admin/faq?edit=${item.id}`}>Sửa</a>
                      </Button>
                      <form action={deleteFaq}>
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
