"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";

type YoutubeEmbedProps = {
  youtubeId: string;
  title: string;
};

export const YoutubeEmbed = ({ youtubeId, title }: YoutubeEmbedProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-black shadow-[0_24px_70px_rgba(15,23,42,0.2)]">
      <div className="relative aspect-video">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="group absolute inset-0 w-full text-left"
            aria-label={`Phát video ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
              alt={title}
              className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/24 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/65">Video YouTube</p>
                <p className="mt-2 text-xl font-semibold leading-snug text-white sm:text-2xl">{title}</p>
              </div>
              <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform group-hover:scale-105">
                <PlayCircle className="size-8" />
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
