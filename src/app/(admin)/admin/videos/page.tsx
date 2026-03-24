import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { extractYoutubeId, joinLines, parseBoolean, parseNumber, slugify, splitLines } from "@/lib/admin-utils";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function saveVideo(formData: FormData) {
  "use server";

  await requireAdmin();

  const originalSlug = String(formData.get("originalSlug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const youtubeUrl = String(formData.get("youtubeUrl") ?? "").trim();
  const youtubeId = String(formData.get("youtubeId") ?? "").trim() || extractYoutubeId(youtubeUrl);
  const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
  const payload = {
    title,
    slug,
    youtubeUrl,
    youtubeId,
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    thumbnailUrl: String(formData.get("thumbnailUrl") ?? "").trim() || `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
    durationLabel: String(formData.get("durationLabel") ?? "").trim() || null,
    featured: parseBoolean(formData.get("featured")),
    sortOrder: parseNumber(formData.get("sortOrder")),
    tags: splitLines(formData.get("tags")),
  };

  if (originalSlug) {
    await prisma.video.update({ where: { slug: originalSlug }, data: payload });
  } else {
    await prisma.video.create({ data: payload });
  }

  revalidatePath("/admin/videos");
  revalidatePath("/");
  redirect("/admin/videos");
}

async function deleteVideo(formData: FormData) {
  "use server";
  await requireAdmin();
  await prisma.video.delete({ where: { slug: String(formData.get("slug") ?? "") } });
  revalidatePath("/admin/videos");
  revalidatePath("/");
  redirect("/admin/videos");
}

export default async function AdminVideosPage({ searchParams }: { searchParams?: Promise<{ edit?: string }> }) {
  const params = await searchParams;
  const [videos, editing] = await Promise.all([
    prisma.video.findMany({ orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { title: "asc" }] }),
    params?.edit ? prisma.video.findUnique({ where: { slug: params.edit } }) : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Video"
        title="Quản lý video YouTube"
        description="Admin nhập tay URL video, hệ thống tự bổ sung YouTube ID và thumbnail để public page render nhanh."
        badge={`${videos.length} mục`}
      />

      <Card className="border-black/10 bg-white/90 shadow-sm">
        <CardContent className="p-6">
          <form action={saveVideo} className="grid gap-5">
            <input type="hidden" name="originalSlug" defaultValue={editing?.slug ?? ""} />
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Tên video</Label>
                <Input id="title" name="title" defaultValue={editing?.title ?? ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" defaultValue={editing?.slug ?? ""} />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube URL</Label>
                <Input id="youtubeUrl" name="youtubeUrl" defaultValue={editing?.youtubeUrl ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtubeId">YouTube ID</Label>
                <Input id="youtubeId" name="youtubeId" defaultValue={editing?.youtubeId ?? ""} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Mô tả ngắn</Label>
              <Textarea id="shortDescription" name="shortDescription" rows={3} defaultValue={editing?.shortDescription ?? ""} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">Link thumbnail</Label>
                <Input id="thumbnailUrl" name="thumbnailUrl" defaultValue={editing?.thumbnailUrl ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationLabel">Thời lượng</Label>
                <Input id="durationLabel" name="durationLabel" defaultValue={editing?.durationLabel ?? ""} />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Thứ tự hiển thị</Label>
                <Input id="sortOrder" name="sortOrder" type="number" defaultValue={editing?.sortOrder ?? 0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Thẻ tag</Label>
                <Textarea id="tags" name="tags" rows={4} defaultValue={joinLines(editing?.tags ?? [])} />
              </div>
            </div>
            <label className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3">
              <input type="checkbox" name="featured" defaultChecked={editing?.featured ?? false} className="size-4 rounded border-black/20" />
              <span className="text-sm font-medium">Đánh dấu nổi bật</span>
            </label>
            <Button type="submit" className="w-fit rounded-full bg-black text-white hover:bg-black/90">
              {editing ? "Cập nhật video" : "Tạo video"}
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
                <TableHead>Thời lượng</TableHead>
                <TableHead>Nổi bật</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.slug}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell>{video.durationLabel ?? "-"}</TableCell>
                  <TableCell>{video.featured ? "Có" : "Không"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="rounded-full bg-white">
                        <a href={`/admin/videos?edit=${video.slug}`}>Sửa</a>
                      </Button>
                      <form action={deleteVideo}>
                        <input type="hidden" name="slug" value={video.slug} />
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
