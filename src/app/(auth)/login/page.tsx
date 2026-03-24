import { redirect } from "next/navigation";
import { AuthShell } from "@/components/shared/auth-shell";
import { LoginForm } from "@/components/shared/login-form";
import { getAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getAuthSession();
  if (session?.user) {
    redirect("/admin/dashboard");
  }

  const params = await searchParams;

  return (
    <AuthShell title="Đăng nhập admin" description="Dùng username hoặc email quản trị để truy cập khu vực điều hành nội dung.">
      <LoginForm nextPath={params.next} />
    </AuthShell>
  );
}
