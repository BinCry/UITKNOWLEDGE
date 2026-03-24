import "server-only";
import {
  AvailabilityStatus,
  CatalogStatus,
  type Course,
  type Product,
  type SiteSetting,
  type Video,
} from "@prisma/client";
import { COURSE_FORM_FALLBACK, MERCH_FORM_FALLBACK, SITE_SETTINGS_ID } from "@/lib/constants";
import { formatCurrency, splitStatLabel, splitTextList } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const fallbackSettings = {
  id: SITE_SETTINGS_ID,
  brandName: "UIT Knowledge",
  brandShortName: "UIT",
  slogan: "Tin Mình đi",
  heroTitle: "Ôn các môn trọng tâm ở UIT theo cách gọn, rõ và dễ theo kịp.",
  heroDescription:
    "UIT Knowledge tổng hợp video và khóa học bám sát Giải tích, Đại số tuyến tính, NMLT, OOP, DSA, Mạng máy tính, CSDL và Hệ điều hành. Nội dung được sắp theo từng môn để bạn tra cứu nhanh và ôn tập đúng trọng tâm.",
  heroBadge: "Tài nguyên học tập cho sinh viên UIT",
  introTitle: "Học đúng môn, xem đúng phần cần ôn",
  introDescription:
    "Website tập trung vào các môn đại cương và cơ sở ngành quen thuộc ở UIT, trình bày ngắn gọn để dễ xem lại trước giờ học hoặc trước kỳ thi.",
  aboutTitle: "Nội dung bám sát từng môn học",
  aboutDescription:
    "Nội dung được sắp theo từng môn để bạn dễ chọn đúng phần đang cần học, ôn giữa kỳ hoặc ôn cuối kỳ.",
  courseFormUrl: COURSE_FORM_FALLBACK,
  merchFormUrl: MERCH_FORM_FALLBACK,
  facebookUrl: "https://www.facebook.com/GenCanyon/",
  zaloPhone: "0971937492",
  contactEmail: "dinh5609@gmail.com",
  address: "",
  footerText: "UIT Knowledge chia sẻ nội dung học tập ngắn gọn, bám môn và dễ theo dõi cho sinh viên UIT.",
  seoTitle: "UIT Knowledge | Video và khóa học cho sinh viên UIT",
  seoDescription: "Video, khóa học và merch của UIT Knowledge cho các môn đại cương và cơ sở ngành tại UIT.",
  youtubeChannelUrl: "",
  studentsCountLabel: "1.5K+ người theo dõi",
  videosCountLabel: "2 video nổi bật",
  coursesCountLabel: "3 khóa học giới thiệu",
  merchCountLabel: "3 sản phẩm merch",
  showFeaturedVideos: true,
  showFeaturedCourses: true,
  showFeaturedProducts: true,
  showTestimonials: false,
  showFaq: true,
  createdAt: new Date(),
  updatedAt: new Date(),
} satisfies SiteSetting;

const availabilityLabels: Record<AvailabilityStatus, string> = {
  IN_STOCK: "Còn hàng",
  LIMITED: "Sắp hết",
  SOLD_OUT: "Hết hàng",
};

const splitTags = (tags: string[]) => tags.filter(Boolean);

const mapCourse = (course: Course, settings: SiteSetting) => ({
  id: course.id,
  slug: course.slug,
  title: course.title,
  category: course.category,
  level: course.level,
  format: course.format,
  duration: course.durationLabel ?? "Đang cập nhật",
  priceLabel: course.priceLabel,
  originalPriceLabel: course.originalPriceLabel ?? "",
  featured: course.featured,
  shortDescription: course.shortDescription,
  longDescription: course.longDescription,
  outline: splitTextList(course.outline),
  audience: splitTextList(course.targetAudience),
  highlights: course.featuredPoints,
  tags: splitTags(course.tags),
  ctaHref: course.ctaUrlOverride || settings.courseFormUrl || COURSE_FORM_FALLBACK,
});

const mapProduct = (product: Product, settings: SiteSetting) => ({
  id: product.id,
  slug: product.slug,
  title: product.title,
  category: product.category,
  priceLabel: formatCurrency(product.price),
  originalPriceLabel: formatCurrency(product.compareAtPrice),
  availability: availabilityLabels[product.availabilityStatus],
  featured: product.featured,
  shortDescription: product.shortDescription,
  longDescription: product.longDescription,
  material: product.material ?? "Đang cập nhật",
  variantText: product.variantText ?? "Đang cập nhật",
  gallery: product.galleryUrls.length ? product.galleryUrls : [product.coverImageUrl || "/logo.jpg"],
  tags: splitTags(product.tags),
  ctaHref: product.ctaUrlOverride || settings.merchFormUrl || MERCH_FORM_FALLBACK,
});

const mapVideo = (video: Video) => ({
  id: video.id,
  slug: video.slug,
  title: video.title,
  youtubeId: video.youtubeId,
  duration: video.durationLabel ?? "Đang cập nhật",
  category: video.tags[0] ?? "Video",
  featured: video.featured,
  shortDescription: video.shortDescription,
  longDescription: video.shortDescription,
  tags: splitTags(video.tags),
});

export async function getSiteSettings() {
  return (await prisma.siteSetting.findUnique({ where: { id: SITE_SETTINGS_ID } })) ?? fallbackSettings;
}

export async function getHomePageData() {
  const settings = await getSiteSettings();
  const [courses, products, videos, testimonials, faqs] = await Promise.all([
    prisma.course.findMany({
      where: { status: CatalogStatus.PUBLISHED, featured: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 3,
    }),
    prisma.product.findMany({
      where: { featured: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 3,
    }),
    prisma.video.findMany({
      where: { featured: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 3,
    }),
    prisma.testimonial.findMany({
      where: { featured: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 3,
    }),
    prisma.faq.findMany({
      where: { featured: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 3,
    }),
  ]);

  return {
    settings,
    highlightStats: [
      splitStatLabel(settings.studentsCountLabel, "Cộng đồng"),
      splitStatLabel(settings.videosCountLabel, "Video"),
      splitStatLabel(settings.coursesCountLabel, "Khóa học"),
      splitStatLabel(settings.merchCountLabel, "Merch"),
    ],
    pillars: [
      {
        title: "Môn đại cương",
        description:
          "Giải tích và Đại số tuyến tính được tóm tắt ngắn gọn để dễ xem lại trước giờ học hoặc trước kỳ thi.",
      },
      {
        title: "Môn cơ sở ngành",
        description:
          "NMLT, OOP, DSA, Mạng máy tính, CSDL và Hệ điều hành được gom theo nhóm nội dung rõ ràng, dễ tra cứu.",
      },
      {
        title: "Khóa học và tài nguyên",
        description:
          "Mỗi khóa học ghi rõ đối tượng phù hợp, nội dung trọng tâm và cách đăng ký để bạn chọn nhanh hơn.",
      },
    ],
    courses: courses.map((item) => mapCourse(item, settings)),
    products: products.map((item) => mapProduct(item, settings)),
    videos: videos.map(mapVideo),
    testimonials,
    faqs,
  };
}

export async function listCourses(filters: { q?: string; category?: string; sort?: string }) {
  const settings = await getSiteSettings();
  const items = await prisma.course.findMany({
    where: {
      status: CatalogStatus.PUBLISHED,
      ...(filters.category && filters.category !== "all" ? { category: filters.category } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const q = filters.q?.toLowerCase().trim() ?? "";
  const mapped = items.map((item) => mapCourse(item, settings)).filter((item) => {
    if (!q) return true;
    return [item.title, item.category, item.level, item.shortDescription, item.tags.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const sorted = [...mapped].sort((a, b) => {
    if (filters.sort === "title") return a.title.localeCompare(b.title, "vi");
    return Number(b.featured) - Number(a.featured);
  });

  return {
    settings,
    items: sorted,
    categories: Array.from(new Set(items.map((item) => item.category))),
  };
}

export async function getCourseBySlug(slug: string) {
  const settings = await getSiteSettings();
  const course = await prisma.course.findUnique({
    where: { slug },
  });

  if (!course || course.status === CatalogStatus.ARCHIVED) {
    return null;
  }

  return mapCourse(course, settings);
}

export async function listProducts(filters: { q?: string; category?: string; sort?: string }) {
  const settings = await getSiteSettings();
  const items = await prisma.product.findMany({
    where: {
      ...(filters.category && filters.category !== "all" ? { category: filters.category } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const q = filters.q?.toLowerCase().trim() ?? "";
  const mapped = items.map((item) => mapProduct(item, settings)).filter((item) => {
    if (!q) return true;
    return [item.title, item.category, item.shortDescription, item.tags.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const sorted = [...mapped].sort((a, b) => {
    if (filters.sort === "price-asc") {
      return Number(a.priceLabel.replace(/[^\d]/g, "")) - Number(b.priceLabel.replace(/[^\d]/g, ""));
    }
    if (filters.sort === "price-desc") {
      return Number(b.priceLabel.replace(/[^\d]/g, "")) - Number(a.priceLabel.replace(/[^\d]/g, ""));
    }
    if (filters.sort === "title") return a.title.localeCompare(b.title, "vi");
    return Number(b.featured) - Number(a.featured);
  });

  return {
    settings,
    items: sorted,
    categories: Array.from(new Set(items.map((item) => item.category))),
  };
}

export async function getProductBySlug(slug: string) {
  const settings = await getSiteSettings();
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) return null;

  return mapProduct(product, settings);
}

export async function listVideos(filters: { q?: string; sort?: string }) {
  const items = await prisma.video.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  const q = filters.q?.toLowerCase().trim() ?? "";
  const mapped = items.map(mapVideo).filter((item) => {
    if (!q) return true;
    return [item.title, item.category, item.shortDescription, item.tags.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  const sorted = [...mapped].sort((a, b) => {
    if (filters.sort === "title") return a.title.localeCompare(b.title, "vi");
    return Number(b.featured) - Number(a.featured);
  });

  return { items: sorted };
}

export async function getVideoBySlug(slug: string) {
  const video = await prisma.video.findUnique({
    where: { slug },
  });

  if (!video) return null;

  return mapVideo(video);
}

export async function getContactData() {
  const settings = await getSiteSettings();
  return {
    facebookUrl: settings.facebookUrl,
    zaloPhone: settings.zaloPhone,
    contactEmail: settings.contactEmail,
    courseFormUrl: settings.courseFormUrl,
    merchFormUrl: settings.merchFormUrl,
  };
}
