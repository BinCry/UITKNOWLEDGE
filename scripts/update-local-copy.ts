import { demoCourses, demoVideos, siteContent } from "../src/lib/demo-content";
import { prisma } from "../src/lib/prisma";

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
  await prisma.siteSetting.update({
    where: { id: "site" },
    data: siteContent,
  });

  await prisma.course.deleteMany({
    where: {
      slug: {
        in: [
          "nen-tang-cau-truc-du-lieu-giai-thuat",
          "nen-tang-nmlt-cho-sinh-vien-uit",
          "lap-trinh-huong-doi-tuong-cho-sinh-vien-uit",
          "lo-trinh-web-cho-sinh-vien-uit",
          "co-ban-mang-may-tinh-cho-sinh-vien-it",
          ...demoCourses.map((item) => item.slug),
        ],
      },
    },
  });

  await prisma.course.createMany({ data: demoCourses });

  await prisma.video.deleteMany({
    where: {
      slug: {
        in: [
          "bat-dau-hoc-lap-trinh-nhu-the-nao",
          "networking-fundamentals-for-beginners",
          ...demoVideos.map((item) => item.slug),
        ],
      },
    },
  });

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

  console.log("Updated local site content.");
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
