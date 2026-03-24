import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { MediaUploader } from "@/components/admin/media-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parseNumber } from "@/lib/admin-utils";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function saveMedia(formData: FormData) {
  "use server";

  await requireAdmin();

  const originalId = String(formData.get("originalId") ?? "");
  const payload = {
    secureUrl: String(formData.get("secureUrl") ?? "").trim(),
    publicId: String(formData.get("publicId") ?? "").trim(),
    alt: String(formData.get("alt") ?? "").trim() || null,
    width: parseNumber(formData.get("width"), 0) || null,
    height: parseNumber(formData.get("height"), 0) || null,
    format: String(formData.get("format") ?? "").trim() || null,
  };

  if (originalId) {
    await prisma.mediaAsset.update({ where: { id: originalId }, data: payload });
  } else {
    await prisma.mediaAsset.create({ data: payload });
  }

  revalidatePath("/admin/media");
  redirect("/admin/media");
}

async function deleteMedia(formData: FormData) {
  "use server";
  await requireAdmin();
  await prisma.mediaAsset.delete({ where: { id: String(formData.get("id") ?? "") } });
  revalidatePath("/admin/media");
  redirect("/admin/media");
}

export default async function AdminMediaPage({ searchParams }: { searchParams?: Promise<{ edit?: string }> }) {
  const params = await searchParams;
  const [items, editing] = await Promise.all([
    prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } }),
    params?.edit ? prisma.mediaAsset.findUnique({ where: { id: params.edit } }) : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Media"
        title="Thư viện media"
        description="Lưu ảnh, public ID và metadata để tái sử dụng trong hero, khóa học, merch và các khối nội dung khác."
        badge={`${items.length} mục`}
      />

      <Card className="border-black/10 bg-white/90 shadow-sm">
        <CardContent className="p-6">
          <MediaUploader />
        </CardContent>
      </Card>

      <Card className="border-black/10 bg-white/90 shadow-sm">
        <CardContent className="p-6">
          <form action={saveMedia} className="grid gap-5">
            <input type="hidden" name="originalId" defaultValue={editing?.id ?? ""} />
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="secureUrl">Secure URL</Label>
                <Input id="secureUrl" name="secureUrl" defaultValue={editing?.secureUrl ?? ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publicId">Public ID</Label>
                <Input id="publicId" name="publicId" defaultValue={editing?.publicId ?? ""} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt">Mô tả ảnh</Label>
              <Input id="alt" name="alt" defaultValue={editing?.alt ?? ""} />
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="width">Chiều rộng</Label>
                <Input id="width" name="width" type="number" defaultValue={editing?.width ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Chiều cao</Label>
                <Input id="height" name="height" type="number" defaultValue={editing?.height ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">Định dạng</Label>
                <Input id="format" name="format" defaultValue={editing?.format ?? ""} />
              </div>
            </div>
            <Button type="submit" className="w-fit rounded-full bg-black text-white hover:bg-black/90">
              {editing ? "Cập nhật media" : "Thêm media"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-black/10 bg-white/90 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Public ID</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.publicId}</TableCell>
                  <TableCell>{item.alt ?? "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="rounded-full bg-white">
                        <a href={`/admin/media?edit=${item.id}`}>Sửa</a>
                      </Button>
                      <form action={deleteMedia}>
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

      <Card className="border-black/10 bg-white/90 shadow-sm">
        <CardContent className="space-y-3 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">Ghi chú</p>
          <p className="text-sm leading-7 text-black/60">
            Thư viện này lưu metadata của ảnh đã tải lên Cloudinary để bạn có thể tái sử dụng nhanh trong nhiều khu vực của website.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
