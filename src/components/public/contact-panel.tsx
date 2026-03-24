"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Facebook, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ContactPanel = ({
  facebookUrl,
  zaloPhone,
  contactEmail,
}: {
  facebookUrl: string;
  zaloPhone: string;
  contactEmail: string;
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const contactItems = [
    { label: "Facebook", value: "GenCanyon", href: facebookUrl, icon: Facebook, accent: "bg-cyan-50 text-cyan-700" },
    {
      label: "Zalo",
      value: `${zaloPhone} - Phan Trong Dinh`,
      href: `https://zalo.me/${zaloPhone}`,
      icon: MessageCircle,
      accent: "bg-slate-950 text-white",
    },
    { label: "Email", value: contactEmail, href: `mailto:${contactEmail}`, icon: Mail, accent: "bg-amber-50 text-amber-700" },
  ];

  const handleCopy = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1600);
  };

  return (
    <div className="surface-panel rounded-[2rem] p-6 sm:p-7">
      <div className="space-y-2">
        <p className="eyebrow-label">Liên hệ nhanh</p>
        <h3 className="text-display text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
          Chọn đúng kênh để trao đổi thuận tiện hơn
        </h3>
        <p className="max-w-2xl text-sm leading-7 text-black/62">
          Facebook phù hợp để theo dõi cập nhật, Zalo thuận tiện khi cần hỏi nhanh, email phù hợp cho nội dung cần mô tả rõ.
        </p>
      </div>

      <div className="mt-6 grid gap-3">
        {contactItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="surface-card flex flex-col gap-4 rounded-[1.55rem] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex size-12 items-center justify-center rounded-2xl ${item.accent}`}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-black/48">{item.label}</p>
                  <p className="font-semibold text-slate-950">{item.value}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild className="rounded-full border-black/10 bg-white">
                  <Link href={item.href} target="_blank" rel="noreferrer">
                    Mở kênh liên hệ
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-black/72 hover:bg-black/[0.04]"
                  onClick={() => handleCopy(item.value, item.label)}
                >
                  <Copy className="size-4" />
                  {copied === item.label ? "Đã sao chép" : "Sao chép"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-[1.5rem] bg-slate-950 px-5 py-4 text-sm leading-7 text-white/76">
        Khóa học và merch dùng biểu mẫu riêng để giữ quy trình đăng ký gọn gàng, rõ ràng và không phát sinh bước không cần thiết.
      </div>
    </div>
  );
};
