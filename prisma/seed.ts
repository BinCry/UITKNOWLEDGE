import "dotenv/config";
import { AdminStatus } from "@prisma/client";
import {
  COURSE_FORM_FALLBACK,
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_ADMIN_USERNAME,
  MERCH_FORM_FALLBACK,
  SITE_SETTINGS_ID,
} from "../src/lib/constants";
import { demoCourses, demoFaqs, demoProducts, demoTestimonials, demoVideos, siteContent } from "../src/lib/demo-content";
import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/security/password";

const extractYoutubeId = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "");
    }

    return parsed.searchParams.get("v") ?? "";
  } catch {
    return "";
  }
};

async function main() {
  const passwordHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);

  await prisma.adminUser.upsert({
    where: { email: DEFAULT_ADMIN_EMAIL },
    update: {
      username: DEFAULT_ADMIN_USERNAME,
      displayName: process.env.SEED_ADMIN_DISPLAY_NAME ?? "Phan Trong Dinh",
      passwordHash,
      role: "ADMIN",
      status: AdminStatus.ACTIVE,
      failedLoginAttempts: 0,
      lastFailedLoginAt: null,
      lockUntil: null,
      mustChangePassword: true,
    },
    create: {
      username: DEFAULT_ADMIN_USERNAME,
      email: DEFAULT_ADMIN_EMAIL,
      displayName: process.env.SEED_ADMIN_DISPLAY_NAME ?? "Phan Trong Dinh",
      passwordHash,
      role: "ADMIN",
      status: AdminStatus.ACTIVE,
      mustChangePassword: true,
    },
  });

  await prisma.siteSetting.upsert({
    where: { id: SITE_SETTINGS_ID },
    update: siteContent,
    create: {
      id: SITE_SETTINGS_ID,
      ...siteContent,
      courseFormUrl: siteContent.courseFormUrl || COURSE_FORM_FALLBACK,
      merchFormUrl: siteContent.merchFormUrl || MERCH_FORM_FALLBACK,
    },
  });

  await prisma.course.deleteMany({ where: { slug: { in: demoCourses.map((item) => item.slug) } } });
  await prisma.course.createMany({ data: demoCourses });

  await prisma.product.deleteMany({ where: { slug: { in: demoProducts.map((item) => item.slug) } } });
  await prisma.product.createMany({ data: demoProducts });

  await prisma.video.deleteMany({ where: { slug: { in: demoVideos.map((item) => item.slug) } } });
  for (const video of demoVideos) {
    const youtubeId = extractYoutubeId(video.youtubeUrl);
    await prisma.video.create({
      data: {
        ...video,
        youtubeId,
        thumbnailUrl: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      },
    });
  }

  await prisma.testimonial.deleteMany({ where: { name: { in: demoTestimonials.map((item) => item.name) } } });
  await prisma.testimonial.createMany({ data: demoTestimonials });

  await prisma.faq.deleteMany({ where: { question: { in: demoFaqs.map((item) => item.question) } } });
  await prisma.faq.createMany({ data: demoFaqs });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
