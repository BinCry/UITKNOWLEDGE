import { AdminStatus } from "@prisma/client";
import { fail, ok } from "@/lib/api";
import { getAuthSession } from "@/lib/auth";
import { parseBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/security/password";
import { changePasswordSchema } from "@/lib/zod-schemas/auth";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return fail({ code: "UNAUTHORIZED", message: "Chưa đăng nhập" }, 401);
    }

    const body = await parseBody(request, changePasswordSchema);
    const user = await prisma.adminUser.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return fail({ code: "NOT_FOUND", message: "Không tìm thấy tài khoản" }, 404);
    }

    const passwordOk = await verifyPassword(body.currentPassword, user.passwordHash);
    if (!passwordOk) {
      return fail({ code: "INVALID_PASSWORD", message: "Mật khẩu hiện tại không đúng" }, 400);
    }

    const newHash = await hashPassword(body.newPassword);
    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        mustChangePassword: false,
        status: AdminStatus.ACTIVE,
        failedLoginAttempts: 0,
        lastFailedLoginAt: null,
        lockUntil: null,
      },
    });

    return ok({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    return fail(
      {
        code: "INVALID_REQUEST",
        message: "Dữ liệu không hợp lệ",
        details: error,
      },
      400,
    );
  }
}
