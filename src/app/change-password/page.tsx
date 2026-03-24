import { redirect } from "next/navigation";
import { AuthShell } from "@/components/shared/auth-shell";
import { ChangePasswordForm } from "@/components/shared/change-password-form";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ChangePasswordPage() {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
    select: { mustChangePassword: true },
  });

  const mustChangePassword = Boolean(user?.mustChangePassword);

  return (
    <AuthShell
      title="Đổi mật khẩu admin"
      description={
        mustChangePassword
          ? "Bạn đang dùng mật khẩu mặc định. Hãy đổi ngay để tiếp tục sử dụng khu admin an toàn hơn."
          : "Cập nhật mật khẩu quản trị để giữ khu admin an toàn và dễ kiểm soát hơn."
      }
    >
      <ChangePasswordForm forceChange={mustChangePassword} />
    </AuthShell>
  );
}
