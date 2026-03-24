import { z } from "zod";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

const codeSchema = z.string().regex(/^\d+$/, "OTP phải là số").min(6).max(8);

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, "Nhập email hoặc username"),
  password: z.string().min(1, "Nhập mật khẩu"),
});

export const otpRequestSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
});

export const otpVerifySchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
  code: codeSchema,
});

export const resetPasswordSchema = z
  .object({
    email: z.string().trim().email("Email không hợp lệ"),
    code: codeSchema,
    newPassword: z.string().min(PASSWORD_MIN_LENGTH, `Mật khẩu tối thiểu ${PASSWORD_MIN_LENGTH} ký tự`),
    confirmPassword: z.string().min(1),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Nhập mật khẩu hiện tại"),
    newPassword: z.string().min(PASSWORD_MIN_LENGTH, `Mật khẩu tối thiểu ${PASSWORD_MIN_LENGTH} ký tự`),
    confirmPassword: z.string().min(1),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
