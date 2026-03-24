import { cn } from "@/lib/utils";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  badges?: string[];
  className?: string;
};

export const PageIntro = ({ eyebrow, title, description, badges = [], className }: PageIntroProps) => (
  <section className={cn("surface-panel mesh-panel relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10", className)}>
    <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
      <div className="max-w-3xl space-y-4">
        <p className="eyebrow-label">{eyebrow}</p>
        <div className="space-y-3">
          <h1 className="text-display max-w-3xl text-[2.35rem] font-semibold leading-[1.06] tracking-[-0.04em] text-pretty text-slate-950 sm:text-5xl sm:leading-[1.02]">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-black/62 sm:text-lg">{description}</p>
        </div>
      </div>

      {badges.length ? (
        <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
          {badges.map((item) => (
            <span key={item} className="rounded-full border border-black/10 bg-white/84 px-3.5 py-2 text-sm text-black/68 whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  </section>
);
