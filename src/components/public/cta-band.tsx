import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type CtaBandProps = {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export const CtaBand = ({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: CtaBandProps) => (
  <section className="surface-panel mesh-panel overflow-hidden rounded-[2.25rem] px-6 py-8 sm:px-8">
    <div className="grid gap-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/82 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
          <BadgeCheck className="size-3.5" />
          Khám phá tiếp
        </div>
        <div className="space-y-3">
          <h3 className="text-display text-3xl font-semibold leading-[1.04] tracking-[-0.04em] text-pretty text-slate-950 sm:text-4xl sm:leading-[1.01]">
            {title}
          </h3>
          <p className="max-w-2xl text-sm leading-7 text-black/62 sm:text-base">{description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 lg:justify-end">
        <Button size="lg" className="rounded-full bg-black px-6 text-white hover:bg-black/90" asChild>
          <Link href={primaryHref}>
            {primaryLabel}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        {secondaryHref && secondaryLabel ? (
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-black/10 bg-white/88 px-6 hover:bg-white"
            asChild
          >
            <Link href={secondaryHref}>{secondaryLabel}</Link>
          </Button>
        ) : null}
      </div>
    </div>
  </section>
);
