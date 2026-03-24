import { AuthShell } from "@/components/shared/auth-shell";
import { ForgotPasswordForm } from "@/components/shared/forgot-password-form";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Quên mật khẩu"
      description="Nhập email quản trị để nhận OTP qua email và tiếp tục đặt lại mật khẩu."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
