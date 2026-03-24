import { fail, ok } from "@/lib/api";
import { getAuthSession } from "@/lib/auth";
import { cloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST() {
  const session = await getAuthSession();
  if (!session?.user) {
    return fail({ code: "UNAUTHORIZED", message: "Bạn cần đăng nhập admin" }, 401);
  }

  if (!isCloudinaryConfigured) {
    return fail({ code: "CLOUDINARY_NOT_CONFIGURED", message: "Cloudinary chưa được cấu hình" }, 503);
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER ?? "uit-knowledge";
  const signature = cloudinary.utils.api_sign_request(
    {
      folder,
      timestamp,
    },
    process.env.CLOUDINARY_API_SECRET as string,
  );

  return ok({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
    timestamp,
    signature,
  });
}
