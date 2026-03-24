import { Card, CardContent } from "@/components/ui/card";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  badge,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  badge?: string;
}) {
  return (
    <Card className="mb-6 overflow-hidden border-black/10 bg-gradient-to-r from-white via-white to-cyan-50/70 shadow-sm">
      <CardContent className="flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-black/40">{eyebrow}</p>
          <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>
          {description ? <p className="max-w-3xl text-sm leading-7 text-black/60">{description}</p> : null}
        </div>
        {badge ? <div className="w-fit rounded-full bg-black px-4 py-2 text-sm font-medium text-white">{badge}</div> : null}
      </CardContent>
    </Card>
  );
}
