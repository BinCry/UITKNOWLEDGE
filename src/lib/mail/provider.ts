import { APP_NAME } from "@/lib/constants";
import { createMailerTransport } from "@/lib/mail/nodemailer";

type SendOtpEmailParams = {
  to: string;
  code: string;
  expiresInMinutes: number;
};

export const sendOtpEmail = async ({ to, code, expiresInMinutes }: SendOtpEmailParams) => {
  const transport = createMailerTransport();
  const from = process.env.MAIL_FROM ?? `${APP_NAME} <no-reply@uitknowledge.local>`;

  await transport.sendMail({
    from,
    to,
    subject: `${APP_NAME} - OTP đặt lại mật khẩu`,
    text: `Mã OTP của bạn là ${code}. Mã có hiệu lực trong ${expiresInMinutes} phút.`,
    html: `<p>Mã OTP của bạn là <strong>${code}</strong>.</p><p>Mã có hiệu lực trong ${expiresInMinutes} phút.</p>`,
  });
};
