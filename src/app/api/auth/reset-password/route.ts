import { AdminStatus } from "@prisma/client";
import { OTP_MAX_VERIFY_ATTEMPTS } from "@/lib/constants";
import { fail, ok } from "@/lib/api";
import { parseBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/security/password";
import { verifyOtpHash } from "@/lib/security/otp";
import { now } from "@/lib/time";
import { resetPasswordSchema } from "@/lib/zod-schemas/auth";

export async function POST(request: Request) {
  try {
    const body = await parseBody(request, resetPasswordSchema);
    const user = await prisma.adminUser.findUnique({
      where: { email: body.email.toLowerCase() },
    });

    if (!user) {
      return fail({ code: "INVALID_REQUEST", message: "Thông tin không hợp lệ" }, 400);
    }

    const otp = await prisma.passwordResetOtp.findFirst({
      where: {
        userId: user.id,
        consumedAt: null,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp || otp.expiresAt <= now()) {
      return fail({ code: "INVALID_OTP", message: "OTP không hợp lệ hoặc đã hết hạn" }, 400);
    }

    if (otp.attemptCount >= OTP_MAX_VERIFY_ATTEMPTS) {
      await prisma.passwordResetOtp.update({
        where: { id: otp.id },
        data: {
          consumedAt: now(),
        },
      });

      return fail({ code: "OTP_LOCKED", message: "OTP đã vượt quá số lần thử" }, 400);
    }

    const isValid = verifyOtpHash(body.code, otp.codeHash);
    if (!isValid) {
      const exhausted = otp.attemptCount + 1 >= OTP_MAX_VERIFY_ATTEMPTS;

      await prisma.passwordResetOtp.update({
        where: { id: otp.id },
        data: {
          attemptCount: { increment: 1 },
          ...(exhausted ? { consumedAt: now() } : {}),
        },
      });

      return fail(
        {
          code: exhausted ? "OTP_LOCKED" : "INVALID_OTP",
          message: exhausted ? "OTP đã vượt quá số lần thử" : "OTP không hợp lệ hoặc đã hết hạn",
        },
        400,
      );
    }

    const newHash = await hashPassword(body.newPassword);
    await prisma.$transaction([
      prisma.adminUser.update({
        where: { id: user.id },
        data: {
          passwordHash: newHash,
          mustChangePassword: false,
          status: AdminStatus.ACTIVE,
          failedLoginAttempts: 0,
          lastFailedLoginAt: null,
          lockUntil: null,
        },
      }),
      prisma.passwordResetOtp.update({
        where: { id: otp.id },
        data: {
          consumedAt: now(),
        },
      }),
    ]);

    return ok({ message: "Đặt lại mật khẩu thành công" });
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
