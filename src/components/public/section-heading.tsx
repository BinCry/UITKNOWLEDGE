import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) => (
  <div className={cn("max-w-3xl space-y-3", align === "center" && "mx-auto text-center", className)}>
    {eyebrow ? <p className="eyebrow-label">{eyebrow}</p> : null}
    <h2 className="text-display text-[2rem] font-semibold leading-[1.06] tracking-[-0.04em] text-pretty text-slate-950 sm:text-[2.85rem] sm:leading-[1.02]">
      {title}
    </h2>
    {description ? <p className="max-w-2xl text-base leading-8 text-black/62">{description}</p> : null}
  </div>
);
