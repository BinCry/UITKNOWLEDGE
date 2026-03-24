import { beforeEach, describe, expect, it, vi } from "vitest";

const prisma = {
  ctaClickEvent: {
    create: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({ prisma }));

describe("GET /api/cta", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("logs the click event and redirects to the external target", async () => {
    const { GET } = await import("@/app/api/cta/route");
    const request = new Request(
      "http://localhost:3000/api/cta?targetType=COURSE&targetUrl=https%3A%2F%2Fexample.com%2Fcourse-form&targetId=course-1&targetLabel=%C4%90%C4%83ng%20k%C3%BD&source=course-detail",
      {
        headers: {
          referer: "http://localhost:3000/khoa-hoc/course-1",
        },
      },
    );

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.com/course-form");
    expect(prisma.ctaClickEvent.create).toHaveBeenCalledWith({
      data: {
        targetType: "COURSE",
        targetId: "course-1",
        targetLabel: "Đăng ký",
        targetUrl: "https://example.com/course-form",
        source: "course-detail",
        referrer: "http://localhost:3000/khoa-hoc/course-1",
      },
    });
  });

  it("falls back to the homepage when required params are invalid", async () => {
    const { GET } = await import("@/app/api/cta/route");
    const request = new Request("http://localhost:3000/api/cta?targetType=INVALID");

    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/");
    expect(prisma.ctaClickEvent.create).not.toHaveBeenCalled();
  });
});
