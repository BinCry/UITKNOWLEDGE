import { describe, expect, it } from "vitest";
import { generateOtpCode, hashOtp, verifyOtpHash } from "@/lib/security/otp";

describe("otp helpers", () => {
  it("generates a numeric otp", () => {
    const code = generateOtpCode();
    expect(code).toMatch(/^\d+$/);
    expect(code).toHaveLength(Number(process.env.OTP_LENGTH ?? 6));
  });

  it("hashes and verifies an otp", () => {
    const code = "123456";
    const hash = hashOtp(code);
    expect(verifyOtpHash(code, hash)).toBe(true);
    expect(verifyOtpHash("654321", hash)).toBe(false);
  });
});
