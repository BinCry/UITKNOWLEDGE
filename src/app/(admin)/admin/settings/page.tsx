import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireAdmin } from "@/lib/auth";
import { SITE_SETTINGS_ID } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

async function saveSettings(formData: FormData) {
  "use server";

  await requireAdmin();

  await prisma.siteSetting.upsert({
    where: { id: SITE_SETTINGS_ID },
    update: {
      brandName: String(formData.get("brandName") ?? ""),
      brandShortName: String(formData.get("brandShortName") ?? ""),
      slogan: String(formData.get("slogan") ?? ""),
      heroTitle: String(formData.get("heroTitle") ?? ""),
      heroDescription: String(formData.get("heroDescription") ?? ""),
      heroBadge: String(formData.get("heroBadge") ?? ""),
      introTitle: String(formData.get("introTitle") ?? ""),
      introDescription: String(formData.get("introDescription") ?? ""),
      aboutTitle: String(formData.get("aboutTitle") ?? ""),
      aboutDescription: String(formData.get("aboutDescription") ?? ""),
      courseFormUrl: String(formData.get("courseFormUrl") ?? ""),
      merchFormUrl: String(formData.get("merchFormUrl") ?? ""),
      facebookUrl: String(formData.get("facebookUrl") ?? ""),
      zaloPhone: String(formData.get("zaloPhone") ?? ""),
      contactEmail: String(formData.get("contactEmail") ?? ""),
      address: String(formData.get("address") ?? "") || null,
      footerText: String(formData.get("footerText") ?? ""),
      seoTitle: String(formData.get("seoTitle") ?? ""),
      seoDescription: String(formData.get("seoDescription") ?? ""),
      youtubeChannelUrl: String(formData.get("youtubeChannelUrl") ?? "") || null,
    },
    create: {
      id: SITE_SETTINGS_ID,
      brandName: String(formData.get("brandName") ?? ""),
      brandShortName: String(formData.get("brandShortName") ?? ""),
      slogan: String(formData.get("slogan") ?? ""),
      heroTitle: String(formData.get("heroTitle") ?? ""),
      heroDescription: String(formData.get("heroDescription") ?? ""),
      heroBadge: String(formData.get("heroBadge") ?? ""),
      introTitle: String(formData.get("introTitle") ?? ""),
      introDescription: String(formData.get("introDescription") ?? ""),
      aboutTitle: String(formData.get("aboutTitle") ?? ""),
      aboutDescription: String(formData.get("aboutDescription") ?? ""),
      courseFormUrl: String(formData.get("courseFormUrl") ?? ""),
      merchFormUrl: String(formData.get("merchFormUrl") ?? ""),
      facebookUrl: String(formData.get("facebookUrl") ?? ""),
      zaloPhone: String(formData.get("zaloPhone") ?? ""),
      contactEmail: String(formData.get("contactEmail") ?? ""),
      address: String(formData.get("address") ?? "") || null,
      footerText: String(formData.get("footerText") ?? ""),
      seoTitle: String(formData.get("seoTitle") ?? ""),
      seoDescription: String(formData.get("seoDescription") ?? ""),
      youtubeChannelUrl: String(formData.get("youtubeChannelUrl") ?? "") || null,
      studentsCountLabel: "1.5K+",
      videosCountLabel: "30+",
      coursesCountLabel: "3+",
      merchCountLabel: "3+",
    },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/admin/dashboard");
  redirect("/admin/settings");
}

export default async function AdminSettingsPage() {
  const setting = await prisma.siteSetting.findUnique({ where: { id: SITE_SETTINGS_ID } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Cài đặt chung"
        title="Cấu hình toàn bộ website"
        description="Cập nhật tên thương hiệu, nội dung SEO, thông tin liên hệ và các biểu mẫu dùng cho toàn bộ hệ thống."
        badge="Toàn cục"
      />

      <Card className="overflow-hidden border-black/10 bg-white/90 shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <form action={saveSettings} className="grid min-w-0 gap-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="min-w-0 space-y-2">
                <Label htmlFor="brandName">Tên thương hiệu</Label>
                <Input id="brandName" name="brandName" defaultValue={setting?.brandName ?? "UIT Knowledge"} />
              </div>
              <div className="min-w-0 space-y-2">
                <Label htmlFor="brandShortName">Tên ngắn</Label>
                <Input id="brandShortName" name="brandShortName" defaultValue={setting?.brandShortName ?? "UIT"} />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="min-w-0 space-y-2">
                <Label htmlFor="slogan">Slogan</Label>
                <Input id="slogan" name="slogan" defaultValue={setting?.slogan ?? "Tin Mình đi"} />
              </div>
              <div className="min-w-0 space-y-2">
                <Label htmlFor="heroBadge">Nhãn nổi bật</Label>
                <Input id="heroBadge" name="heroBadge" defaultValue={setting?.heroBadge ?? ""} />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="min-w-0 space-y-2">
                <Label htmlFor="seoTitle">Tiêu đề SEO</Label>
                <Textarea id="seoTitle" name="seoTitle" rows={2} defaultValue={setting?.seoTitle ?? ""} />
              </div>
              <div className="min-w-0 space-y-2">
                <Label htmlFor="seoDescription">Mô tả SEO</Label>
                <Textarea id="seoDescription" name="seoDescription" rows={3} defaultValue={setting?.seoDescription ?? ""} />
              </div>
            </div>

            <div className="min-w-0 space-y-2">
              <Label htmlFor="footerText">Nội dung chân trang</Label>
              <Textarea id="footerText" name="footerText" defaultValue={setting?.footerText ?? ""} rows={3} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="min-w-0 space-y-2">
                <Label htmlFor="facebookUrl">Liên kết Facebook</Label>
                <Textarea id="facebookUrl" name="facebookUrl" defaultValue={setting?.facebookUrl ?? ""} rows={3} />
              </div>
              <div className="min-w-0 space-y-2">
                <Label htmlFor="youtubeChannelUrl">Liên kết kênh YouTube</Label>
                <Textarea id="youtubeChannelUrl" name="youtubeChannelUrl" defaultValue={setting?.youtubeChannelUrl ?? ""} rows={3} />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="min-w-0 space-y-2">
                <Label htmlFor="zaloPhone">Số Zalo</Label>
                <Input id="zaloPhone" name="zaloPhone" defaultValue={setting?.zaloPhone ?? ""} />
              </div>
              <div className="min-w-0 space-y-2">
                <Label htmlFor="contactEmail">Email liên hệ</Label>
                <Input id="contactEmail" name="contactEmail" defaultValue={setting?.contactEmail ?? ""} />
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="min-w-0 space-y-2">
                <Label htmlFor="courseFormUrl">Biểu mẫu khóa học</Label>
                <Textarea id="courseFormUrl" name="courseFormUrl" defaultValue={setting?.courseFormUrl ?? ""} rows={4} />
              </div>
              <div className="min-w-0 space-y-2">
                <Label htmlFor="merchFormUrl">Biểu mẫu merch</Label>
                <Textarea id="merchFormUrl" name="merchFormUrl" defaultValue={setting?.merchFormUrl ?? ""} rows={4} />
              </div>
            </div>

            <div className="min-w-0 space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Textarea id="address" name="address" defaultValue={setting?.address ?? ""} rows={2} />
            </div>

            <Button type="submit" className="w-fit rounded-full bg-black text-white hover:bg-black/90">
              Lưu cấu hình
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
