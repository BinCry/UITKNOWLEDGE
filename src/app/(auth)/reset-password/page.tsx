import { AuthShell } from "@/components/shared/auth-shell";
import { ResetPasswordForm } from "@/components/shared/reset-password-form";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Đặt lại mật khẩu"
      description="Nhập email admin, mã OTP và mật khẩu mới để khôi phục quyền truy cập."
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
