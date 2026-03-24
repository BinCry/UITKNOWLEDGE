/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowUpRight, PlayCircle, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

type VideoCardProps = {
  title: string;
  description: string;
  youtubeId: string;
  href: string;
  duration: string;
  featured?: boolean;
};

export const VideoCard = ({ title, description, youtubeId, href, duration, featured }: VideoCardProps) => (
  <article className="surface-card group overflow-hidden rounded-[1.9rem] transition-transform duration-300 hover:-translate-y-1">
    <div className="relative aspect-video overflow-hidden bg-black">
      <img
        src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
        alt={title}
        className="h-full w-full object-cover opacity-92 transition duration-500 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent" />

      <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
        {featured ? <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-medium">Nổi bật</span> : null}
        <span className="rounded-full bg-black/72 px-3 py-1 text-xs font-medium text-white">{duration}</span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-white/92 text-black shadow-lg transition-transform group-hover:scale-105">
          <PlayCircle className="size-8" />
        </div>
      </div>
    </div>

    <div className="space-y-4 p-6">
      <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-black/42">
        <Youtube className="size-3.5 text-red-500" />
        Video YouTube
      </div>

      <div className="space-y-3">
        <h3 className="text-display text-2xl font-semibold leading-tight text-slate-950">{title}</h3>
        <p className="text-sm leading-7 text-black/62">{description}</p>
      </div>

      <div className="flex items-center justify-between border-t border-black/6 pt-5">
        <Button variant="outline" className="rounded-full border-black/10 bg-white" asChild>
          <Link href={href}>Xem video</Link>
        </Button>
        <span className="rounded-full border border-black/8 bg-white p-2 text-black/58">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </div>
  </article>
);
