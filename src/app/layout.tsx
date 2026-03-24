import type { Metadata } from "next";
import { Be_Vietnam_Pro, Manrope } from "next/font/google";
import { AppProviders } from "@/components/layout/app-providers";
import { APP_NAME } from "@/lib/constants";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-vn",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: APP_NAME,
    template: "%s | UIT Knowledge",
  },
  description: "UIT Knowledge tổng hợp video, khóa học và merch dành cho sinh viên UIT theo hướng ngắn gọn, dễ theo dõi.",
  openGraph: {
    title: APP_NAME,
    description: "Video, khóa học và tài nguyên học tập dành cho sinh viên UIT.",
    type: "website",
    locale: "vi_VN",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={`${beVietnam.variable} ${manrope.variable} bg-background antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
