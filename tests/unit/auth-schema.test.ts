import { describe, expect, it } from "vitest";
import { loginSchema, resetPasswordSchema } from "@/lib/zod-schemas/auth";

describe("auth schemas", () => {
  it("accepts a login payload", () => {
    const parsed = loginSchema.safeParse({
      identifier: "admin",
      password: "admin",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects mismatched password confirmation", () => {
    const parsed = resetPasswordSchema.safeParse({
      email: "admin@uitknowledge.local",
      code: "123456",
      newPassword: "password123",
      confirmPassword: "password321",
    });

    expect(parsed.success).toBe(false);
  });
});
