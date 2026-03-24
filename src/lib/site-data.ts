export type SiteLink = {
  label: string;
  href: string;
};

export const siteNavigation: SiteLink[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Khóa học", href: "/khoa-hoc" },
  { label: "Video", href: "/video" },
  { label: "Merch", href: "/merch" },
  { label: "Liên hệ", href: "/lien-he" },
];
