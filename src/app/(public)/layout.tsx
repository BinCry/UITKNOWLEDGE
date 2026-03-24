import { PublicShell } from "@/components/public/public-shell";
import { getSiteSettings } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <PublicShell
      brandName={settings.brandName}
      slogan={settings.slogan}
      description={settings.footerText}
      facebookUrl={settings.facebookUrl}
      zaloPhone={settings.zaloPhone}
      contactEmail={settings.contactEmail}
    >
      {children}
    </PublicShell>
  );
}
