import { describe, expect, it } from "vitest";
import { slugify, splitLines } from "@/lib/admin-utils";

describe("admin utils", () => {
  it("slugifies vietnamese text", () => {
    expect(slugify("Áo thun Tin Mình đi")).toBe("ao-thun-tin-minh-di");
  });

  it("splits textarea values by line", () => {
    const items = splitLines("item 1\nitem 2\n\nitem 3");
    expect(items).toEqual(["item 1", "item 2", "item 3"]);
  });
});
