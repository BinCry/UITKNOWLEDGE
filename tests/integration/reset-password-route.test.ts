import { beforeEach, describe, expect, it, vi } from "vitest";

const prisma = {
  adminUser: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  passwordResetOtp: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  $transaction: vi.fn(),
};

const hashPassword = vi.fn();
const verifyOtpHash = vi.fn();

vi.mock("@/lib/prisma", () => ({ prisma }));
vi.mock("@/lib/security/password", () => ({ hashPassword }));
vi.mock("@/lib/security/otp", () => ({ verifyOtpHash }));

describe("POST /api/auth/reset-password", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prisma.$transaction.mockResolvedValue([]);
    hashPassword.mockResolvedValue("hashed-password");
  });

  it("increments attempts when OTP is invalid", async () => {
    prisma.adminUser.findUnique.mockResolvedValue({
      id: "admin-1",
      email: "admin@example.com",
    });
    prisma.passwordResetOtp.findFirst.mockResolvedValue({
      id: "otp-1",
      userId: "admin-1",
      codeHash: "hashed-otp",
      attemptCount: 0,
      expiresAt: new Date(Date.now() + 60_000),
      createdAt: new Date(),
    });
    verifyOtpHash.mockReturnValue(false);

    const { POST } = await import("@/app/api/auth/reset-password/route");
    const response = await POST(
      new Request("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "admin@example.com",
          code: "123456",
          newPassword: "new-password",
          confirmPassword: "new-password",
        }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      error: {
        code: "INVALID_OTP",
      },
    });
    expect(prisma.passwordResetOtp.update).toHaveBeenCalledWith({
      where: { id: "otp-1" },
      data: {
        attemptCount: { increment: 1 },
      },
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("locks and consumes OTP on the final invalid attempt", async () => {
    prisma.adminUser.findUnique.mockResolvedValue({
      id: "admin-1",
      email: "admin@example.com",
    });
    prisma.passwordResetOtp.findFirst.mockResolvedValue({
      id: "otp-1",
      userId: "admin-1",
      codeHash: "hashed-otp",
      attemptCount: 4,
      expiresAt: new Date(Date.now() + 60_000),
      createdAt: new Date(),
    });
    verifyOtpHash.mockReturnValue(false);

    const { POST } = await import("@/app/api/auth/reset-password/route");
    const response = await POST(
      new Request("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "admin@example.com",
          code: "123456",
          newPassword: "new-password",
          confirmPassword: "new-password",
        }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      error: {
        code: "OTP_LOCKED",
      },
    });
    expect(prisma.passwordResetOtp.update).toHaveBeenCalledWith({
      where: { id: "otp-1" },
      data: expect.objectContaining({
        attemptCount: { increment: 1 },
      }),
    });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("resets the password and consumes the OTP when the code is valid", async () => {
    prisma.adminUser.findUnique.mockResolvedValue({
      id: "admin-1",
      email: "admin@example.com",
    });
    prisma.passwordResetOtp.findFirst.mockResolvedValue({
      id: "otp-1",
      userId: "admin-1",
      codeHash: "hashed-otp",
      attemptCount: 1,
      expiresAt: new Date(Date.now() + 60_000),
      createdAt: new Date(),
    });
    prisma.adminUser.update.mockResolvedValue({ id: "admin-1" });
    prisma.passwordResetOtp.update.mockResolvedValue({ id: "otp-1" });
    verifyOtpHash.mockReturnValue(true);

    const { POST } = await import("@/app/api/auth/reset-password/route");
    const response = await POST(
      new Request("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "admin@example.com",
          code: "123456",
          newPassword: "new-password",
          confirmPassword: "new-password",
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        message: expect.any(String),
      },
    });
    expect(hashPassword).toHaveBeenCalledWith("new-password");
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });
});
