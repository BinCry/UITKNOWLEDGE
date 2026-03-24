import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CatalogCardProps = {
  title: string;
  description: string;
  href: string;
  badge?: string;
  meta?: string[];
  price?: string;
  ctaLabel?: string;
  accent?: "cyan" | "amber" | "neutral";
  className?: string;
};

const accentMap = {
  cyan: {
    line: "bg-cyan-500/85",
    badge: "bg-cyan-50 text-cyan-700",
    chip: "bg-cyan-50/85 text-cyan-900",
  },
  amber: {
    line: "bg-amber-500/85",
    badge: "bg-amber-50 text-amber-700",
    chip: "bg-amber-50/85 text-amber-900",
  },
  neutral: {
    line: "bg-slate-900/82",
    badge: "bg-slate-100 text-slate-700",
    chip: "bg-slate-100 text-slate-800",
  },
} as const;

export const CatalogCard = ({
  title,
  description,
  href,
  badge,
  meta = [],
  price,
  ctaLabel = "Xem chi tiết",
  accent = "neutral",
  className,
}: CatalogCardProps) => {
  const styles = accentMap[accent];

  return (
    <article
      className={cn(
        "surface-card group flex h-full flex-col rounded-[1.85rem] p-6 transition-transform duration-300 hover:-translate-y-1",
        className,
      )}
    >
      <div className={cn("h-1.5 w-16 rounded-full", styles.line)} />

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="space-y-3">
          {badge ? (
            <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-medium", styles.badge)}>{badge}</span>
          ) : null}
          <h3 className="text-display text-2xl font-semibold leading-tight text-slate-950">{title}</h3>
        </div>

        <span className="rounded-full border border-black/8 bg-white p-2 text-black/58 transition-all group-hover:bg-black group-hover:text-white">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-black/62 sm:min-h-[5.25rem]">{description}</p>

      {meta.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {meta.map((item) => (
            <span key={item} className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs", styles.chip)}>
              <CheckCircle2 className="size-3.5" />
              {item}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-black/6 pt-6">
        {price ? <p className="text-xl font-semibold text-slate-950">{price}</p> : <span />}
        <Button variant="outline" size="sm" asChild className="rounded-full border-black/10 bg-white">
          <Link href={href}>{ctaLabel}</Link>
        </Button>
      </div>
    </article>
  );
};
