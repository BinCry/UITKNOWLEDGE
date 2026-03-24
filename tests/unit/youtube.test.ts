import { describe, expect, it } from "vitest";
import { getYoutubeId, getYoutubeThumbnail } from "@/lib/youtube";

describe("youtube helpers", () => {
  it("extracts id from watch URL", () => {
    expect(getYoutubeId("https://www.youtube.com/watch?v=PkZNo7MFNFg")).toBe("PkZNo7MFNFg");
  });

  it("extracts id from short URL", () => {
    expect(getYoutubeId("https://youtu.be/qiQR5rTSshw")).toBe("qiQR5rTSshw");
  });

  it("builds thumbnail URL from id", () => {
    expect(getYoutubeThumbnail("abc123")).toBe("https://i.ytimg.com/vi/abc123/hqdefault.jpg");
  });
});
