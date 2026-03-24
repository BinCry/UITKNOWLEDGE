import { revalidatePath } from "next/cache";
import { fail, ok } from "@/lib/api";
import { getAuthSession } from "@/lib/auth";
import { parseBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const mediaAssetSchema = z.object({
  secureUrl: z.string().url(),
  publicId: z.string().min(1),
  alt: z.string().trim().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  format: z.string().trim().optional(),
});

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return fail({ code: "UNAUTHORIZED", message: "Bạn cần đăng nhập admin" }, 401);
  }

  try {
    const body = await parseBody(request, mediaAssetSchema);
    const item = await prisma.mediaAsset.create({
      data: {
        secureUrl: body.secureUrl,
        publicId: body.publicId,
        alt: body.alt || null,
        width: body.width,
        height: body.height,
        format: body.format || null,
      },
    });

    revalidatePath("/admin/media");
    return ok(item, 201);
  } catch (error) {
    return fail({ code: "INVALID_REQUEST", message: "Không lưu được media", details: error }, 400);
  }
}
