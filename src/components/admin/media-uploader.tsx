"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SignaturePayload = {
  success: boolean;
  data?: {
    cloudName: string;
    apiKey: string;
    folder: string;
    timestamp: number;
    signature: string;
  };
  error?: {
    message: string;
  };
};

export function MediaUploader() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const file = fileRef.current?.files?.[0];

    if (!file) {
      toast.error("Hãy chọn một ảnh để tải lên.");
      return;
    }

    startTransition(async () => {
      const signatureResponse = await fetch("/api/admin/media/signature", {
        method: "POST",
      });
      const signaturePayload = (await signatureResponse.json()) as SignaturePayload;

      if (!signaturePayload.success || !signaturePayload.data) {
        toast.error(signaturePayload.error?.message ?? "Không lấy được chữ ký Cloudinary.");
        return;
      }

      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("api_key", signaturePayload.data.apiKey);
      uploadForm.append("timestamp", String(signaturePayload.data.timestamp));
      uploadForm.append("signature", signaturePayload.data.signature);
      uploadForm.append("folder", signaturePayload.data.folder);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signaturePayload.data.cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadForm,
        },
      );

      if (!uploadResponse.ok) {
        toast.error("Tải ảnh lên Cloudinary thất bại.");
        return;
      }

      const uploadPayload = (await uploadResponse.json()) as {
        secure_url: string;
        public_id: string;
        width?: number;
        height?: number;
        format?: string;
      };

      const persistResponse = await fetch("/api/admin/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secureUrl: uploadPayload.secure_url,
          publicId: uploadPayload.public_id,
          alt,
          width: uploadPayload.width,
          height: uploadPayload.height,
          format: uploadPayload.format,
        }),
      });

      const persistPayload = (await persistResponse.json()) as SignaturePayload;
      if (!persistPayload.success) {
        toast.error(persistPayload.error?.message ?? "Không lưu được media vào cơ sở dữ liệu.");
        return;
      }

      toast.success("Tải ảnh thành công.");
      setAlt("");
      if (fileRef.current) {
        fileRef.current.value = "";
      }
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-[1.75rem] border border-dashed border-black/15 bg-black/[0.02] p-5">
      <div className="space-y-2">
        <Label htmlFor="media-file">Ảnh từ máy</Label>
        <Input id="media-file" ref={fileRef} type="file" accept="image/*" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="media-alt">Mô tả ảnh</Label>
        <Input id="media-alt" value={alt} onChange={(event) => setAlt(event.target.value)} placeholder="Mô tả ngắn cho ảnh" />
      </div>
      <Button type="submit" className="w-fit rounded-full bg-black text-white hover:bg-black/90" disabled={isPending}>
        {isPending ? "Đang tải lên..." : "Tải lên Cloudinary"}
      </Button>
    </form>
  );
}
