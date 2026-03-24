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

async function seedAdmin() {
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: DEFAULT_ADMIN_EMAIL },
    select: { id: true },
  });

  if (existingAdmin) return;

  const passwordHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);

  await prisma.adminUser.create({
    data: {
      username: DEFAULT_ADMIN_USERNAME,
      email: DEFAULT_ADMIN_EMAIL,
      displayName: process.env.SEED_ADMIN_DISPLAY_NAME ?? "Phan Trong Dinh",
      passwordHash,
      role: "ADMIN",
      status: AdminStatus.ACTIVE,
      mustChangePassword: true,
    },
  });
}

async function seedSiteSettings() {
  const existingSettings = await prisma.siteSetting.findUnique({
    where: { id: SITE_SETTINGS_ID },
    select: { id: true },
  });

  if (existingSettings) return;

  await prisma.siteSetting.create({
    data: {
      id: SITE_SETTINGS_ID,
      ...siteContent,
      courseFormUrl: siteContent.courseFormUrl || COURSE_FORM_FALLBACK,
      merchFormUrl: siteContent.merchFormUrl || MERCH_FORM_FALLBACK,
    },
  });
}

async function seedCourses() {
  const existingCount = await prisma.course.count();
  if (existingCount > 0) return;

  await prisma.course.createMany({ data: demoCourses });
}

async function seedProducts() {
  const existingCount = await prisma.product.count();
  if (existingCount > 0) return;

  await prisma.product.createMany({ data: demoProducts });
}

async function seedVideos() {
  const existingCount = await prisma.video.count();
  if (existingCount > 0) return;

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
}

async function seedTestimonials() {
  const existingCount = await prisma.testimonial.count();
  if (existingCount > 0) return;

  await prisma.testimonial.createMany({ data: demoTestimonials });
}

async function seedFaqs() {
  const existingCount = await prisma.faq.count();
  if (existingCount > 0) return;

  await prisma.faq.createMany({ data: demoFaqs });
}

async function main() {
  await seedAdmin();
  await seedSiteSettings();
  await seedCourses();
  await seedProducts();
  await seedVideos();
  await seedTestimonials();
  await seedFaqs();
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
