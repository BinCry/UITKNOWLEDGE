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
import { parseBoolean } from "@/lib/admin-utils";

async function saveLanding(formData: FormData) {
  "use server";

  await requireAdmin();

  await prisma.siteSetting.upsert({
    where: { id: SITE_SETTINGS_ID },
    create: {
      id: SITE_SETTINGS_ID,
      brandName: "UIT Knowledge",
      brandShortName: "UIT",
      slogan: "Tin Mình đi",
      heroTitle: String(formData.get("heroTitle") ?? ""),
      heroDescription: String(formData.get("heroDescription") ?? ""),
      heroBadge: String(formData.get("heroBadge") ?? ""),
      introTitle: String(formData.get("introTitle") ?? ""),
      introDescription: String(formData.get("introDescription") ?? ""),
      aboutTitle: String(formData.get("aboutTitle") ?? ""),
      aboutDescription: String(formData.get("aboutDescription") ?? ""),
      courseFormUrl: "",
      merchFormUrl: "",
      facebookUrl: "",
      zaloPhone: "",
      contactEmail: "",
      address: null,
      footerText: "",
      seoTitle: "",
      seoDescription: "",
      youtubeChannelUrl: null,
      studentsCountLabel: String(formData.get("studentsCountLabel") ?? ""),
      videosCountLabel: String(formData.get("videosCountLabel") ?? ""),
      coursesCountLabel: String(formData.get("coursesCountLabel") ?? ""),
      merchCountLabel: String(formData.get("merchCountLabel") ?? ""),
      showFeaturedVideos: parseBoolean(formData.get("showFeaturedVideos")),
      showFeaturedCourses: parseBoolean(formData.get("showFeaturedCourses")),
      showFeaturedProducts: parseBoolean(formData.get("showFeaturedProducts")),
      showTestimonials: parseBoolean(formData.get("showTestimonials")),
      showFaq: parseBoolean(formData.get("showFaq")),
    },
    update: {
      heroTitle: String(formData.get("heroTitle") ?? ""),
      heroDescription: String(formData.get("heroDescription") ?? ""),
      heroBadge: String(formData.get("heroBadge") ?? ""),
      introTitle: String(formData.get("introTitle") ?? ""),
      introDescription: String(formData.get("introDescription") ?? ""),
      aboutTitle: String(formData.get("aboutTitle") ?? ""),
      aboutDescription: String(formData.get("aboutDescription") ?? ""),
      studentsCountLabel: String(formData.get("studentsCountLabel") ?? ""),
      videosCountLabel: String(formData.get("videosCountLabel") ?? ""),
      coursesCountLabel: String(formData.get("coursesCountLabel") ?? ""),
      merchCountLabel: String(formData.get("merchCountLabel") ?? ""),
      showFeaturedVideos: parseBoolean(formData.get("showFeaturedVideos")),
      showFeaturedCourses: parseBoolean(formData.get("showFeaturedCourses")),
      showFeaturedProducts: parseBoolean(formData.get("showFeaturedProducts")),
      showTestimonials: parseBoolean(formData.get("showTestimonials")),
      showFaq: parseBoolean(formData.get("showFaq")),
    },
  });

  revalidatePath("/admin/landing");
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  redirect("/admin/landing");
}

export default async function AdminLandingPage() {
  const setting = await prisma.siteSetting.findUnique({ where: { id: SITE_SETTINGS_ID } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Landing page"
        title="Nội dung hero và các khối chính của trang chủ"
        description="Chỉnh các thông điệp quan trọng để người xem vừa vào web là hiểu ngay kênh đang tập trung vào các môn nào ở UIT."
        badge="Trang chủ"
      />

      <Card className="border-black/10 bg-white/90 shadow-sm">
        <CardContent className="p-6">
          <form action={saveLanding} className="grid gap-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="heroBadge">Nhãn hero</Label>
                <Input id="heroBadge" name="heroBadge" defaultValue={setting?.heroBadge ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Tiêu đề hero</Label>
                <Input id="heroTitle" name="heroTitle" defaultValue={setting?.heroTitle ?? ""} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroDescription">Mô tả hero</Label>
              <Textarea id="heroDescription" name="heroDescription" rows={4} defaultValue={setting?.heroDescription ?? ""} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="introTitle">Tiêu đề phần giới thiệu</Label>
                <Input id="introTitle" name="introTitle" defaultValue={setting?.introTitle ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="introDescription">Mô tả phần giới thiệu</Label>
                <Textarea id="introDescription" name="introDescription" rows={3} defaultValue={setting?.introDescription ?? ""} />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="aboutTitle">Tiêu đề phần thương hiệu</Label>
                <Input id="aboutTitle" name="aboutTitle" defaultValue={setting?.aboutTitle ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aboutDescription">Mô tả phần thương hiệu</Label>
                <Textarea id="aboutDescription" name="aboutDescription" rows={3} defaultValue={setting?.aboutDescription ?? ""} />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="studentsCountLabel">Số liệu cộng đồng</Label>
                <Input id="studentsCountLabel" name="studentsCountLabel" defaultValue={setting?.studentsCountLabel ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videosCountLabel">Số liệu video</Label>
                <Input id="videosCountLabel" name="videosCountLabel" defaultValue={setting?.videosCountLabel ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coursesCountLabel">Số liệu khóa học</Label>
                <Input id="coursesCountLabel" name="coursesCountLabel" defaultValue={setting?.coursesCountLabel ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="merchCountLabel">Số liệu merch</Label>
                <Input id="merchCountLabel" name="merchCountLabel" defaultValue={setting?.merchCountLabel ?? ""} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {[
                ["showFeaturedVideos", "Hiện video nổi bật"],
                ["showFeaturedCourses", "Hiện khóa học nổi bật"],
                ["showFeaturedProducts", "Hiện merch nổi bật"],
                ["showTestimonials", "Hiện cảm nhận"],
                ["showFaq", "Hiện FAQ"],
              ].map(([name, label]) => (
                <label key={name} className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3">
                  <input
                    id={name}
                    name={name}
                    type="checkbox"
                    defaultChecked={Boolean(setting?.[name as keyof typeof setting])}
                    className="size-4 rounded border-black/20"
                  />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
            <Button type="submit" className="w-fit rounded-full bg-black text-white hover:bg-black/90">
              Lưu nội dung landing page
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
