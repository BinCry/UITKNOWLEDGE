import { beforeEach, describe, expect, it, vi } from "vitest";

const prisma = {
  adminUser: {
    findUnique: vi.fn(),
  },
  passwordResetOtp: {
    create: vi.fn(),
  },
};

const sendOtpEmail = vi.fn();
const consumeRateLimit = vi.fn();
const generateOtpCode = vi.fn();
const hashOtp = vi.fn();

vi.mock("@/lib/prisma", () => ({ prisma }));
vi.mock("@/lib/mail/provider", () => ({ sendOtpEmail }));
vi.mock("@/lib/security/rate-limit", () => ({ consumeRateLimit }));
vi.mock("@/lib/security/otp", () => ({
  generateOtpCode,
  hashOtp,
}));

describe("POST /api/auth/reset-request-otp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    consumeRateLimit.mockReturnValue({ allowed: true, remaining: 4, resetAt: Date.now() + 60_000 });
    generateOtpCode.mockReturnValue("123456");
    hashOtp.mockReturnValue("hashed-otp");
  });

  it("creates and emails an OTP when the admin email exists", async () => {
    prisma.adminUser.findUnique.mockResolvedValue({
      id: "admin-1",
      email: "admin@example.com",
    });
    prisma.passwordResetOtp.create.mockResolvedValue({ id: "otp-1" });
    sendOtpEmail.mockResolvedValue(undefined);

    const { POST } = await import("@/app/api/auth/reset-request-otp/route");
    const response = await POST(
      new Request("http://localhost:3000/api/auth/reset-request-otp", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "127.0.0.1",
        },
        body: JSON.stringify({ email: "Admin@Example.com" }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        message: expect.any(String),
      },
    });
    expect(consumeRateLimit).toHaveBeenCalledWith(expect.stringContaining("admin@example.com:127.0.0.1"), 5, 15);
    expect(prisma.adminUser.findUnique).toHaveBeenCalledWith({
      where: { email: "admin@example.com" },
    });
    expect(prisma.passwordResetOtp.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "admin-1",
        codeHash: "hashed-otp",
      }),
    });
    expect(sendOtpEmail).toHaveBeenCalledWith({
      to: "admin@example.com",
      code: "123456",
      expiresInMinutes: 5,
    });
  });

  it("returns 429 when the request is rate limited", async () => {
    consumeRateLimit.mockReturnValue({ allowed: false, remaining: 0, resetAt: Date.now() + 60_000 });

    const { POST } = await import("@/app/api/auth/reset-request-otp/route");
    const response = await POST(
      new Request("http://localhost:3000/api/auth/reset-request-otp", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-real-ip": "127.0.0.1",
        },
        body: JSON.stringify({ email: "admin@example.com" }),
      }),
    );

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      error: {
        code: "RATE_LIMIT",
      },
    });
    expect(prisma.adminUser.findUnique).not.toHaveBeenCalled();
    expect(prisma.passwordResetOtp.create).not.toHaveBeenCalled();
    expect(sendOtpEmail).not.toHaveBeenCalled();
  });
});
