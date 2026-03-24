export const getYoutubeId = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "");
    }

    if (parsed.pathname.includes("/shorts/")) {
      return parsed.pathname.split("/shorts/")[1] ?? "";
    }

    if (parsed.pathname.includes("/embed/")) {
      return parsed.pathname.split("/embed/")[1] ?? "";
    }

    return parsed.searchParams.get("v") ?? "";
  } catch {
    return "";
  }
};

export const getYoutubeThumbnail = (youtubeId: string) => `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
