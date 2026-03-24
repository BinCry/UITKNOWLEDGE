import { AdminStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function saveProfile(formData: FormData) {
  "use server";

  await requireAdmin({ allowPasswordChange: true });

  const userId = String(formData.get("userId") ?? "");
  await prisma.adminUser.update({
    where: { id: userId },
    data: {
      username: String(formData.get("username") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim().toLowerCase(),
      displayName: String(formData.get("displayName") ?? "").trim() || null,
      status: AdminStatus.ACTIVE,
    },
  });

  revalidatePath("/admin/profile");
  revalidatePath("/admin/dashboard");
  redirect("/admin/profile");
}

export default async function AdminProfilePage() {
  const session = await requireAdmin();
  const user = await prisma.adminUser.findUnique({ where: { id: session.user.id } });

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Tài khoản"
        title="Thông tin tài khoản admin"
        description="Cập nhật username, email và tên hiển thị. Phần đổi mật khẩu được tách ra để bảo mật rõ ràng hơn."
        badge={user.mustChangePassword ? "Cần đổi mật khẩu" : "An toàn"}
      />

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="overflow-hidden border-slate-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-sm">
          <CardContent className="space-y-5 p-7">
            <p className="text-xs uppercase tracking-[0.32em] text-white/45">Nhận diện admin</p>
            <h2 className="text-3xl font-semibold">{user.displayName ?? user.username}</h2>
            <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
              <p className="text-sm text-white/72">Username: {user.username}</p>
              <p className="break-words text-sm text-white/72 [overflow-wrap:anywhere]">Email: {user.email}</p>
              <p className="text-sm text-white/72">Trạng thái: {user.status}</p>
            </div>
            <Button className="rounded-full bg-white text-black hover:bg-white/90" asChild>
              <a href="/change-password">Đổi mật khẩu</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-black/10 bg-white/90 shadow-sm">
          <CardContent className="p-6">
            <form action={saveProfile} className="grid gap-5">
              <input type="hidden" name="userId" value={user.id} />
              <div className="space-y-2">
                <Label htmlFor="displayName">Tên hiển thị</Label>
                <Input id="displayName" name="displayName" defaultValue={user.displayName ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" defaultValue={user.username} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={user.email} required />
              </div>
              <Button type="submit" className="w-fit rounded-full bg-black text-white hover:bg-black/90">
                Lưu hồ sơ
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
