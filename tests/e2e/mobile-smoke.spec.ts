import { expect, test, type Page } from "@playwright/test";

const mobileViewport = { width: 390, height: 844 };

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;

    return {
      viewportWidth: window.innerWidth,
      docScrollWidth: doc.scrollWidth,
      bodyScrollWidth: body.scrollWidth,
    };
  });

  expect(overflow.docScrollWidth).toBeLessThanOrEqual(overflow.viewportWidth + 1);
  expect(overflow.bodyScrollWidth).toBeLessThanOrEqual(overflow.viewportWidth + 1);
}

test.describe("mobile public smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(mobileViewport);
  });

  test("home renders without horizontal overflow and shows core mobile actions", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('a[href="/khoa-hoc"]:visible').first()).toBeVisible();
    await expect(page.locator('a[href="/video"]:visible').first()).toBeVisible();
    await expect(page.locator("header button").first()).toBeVisible();
    await expect(page.locator('a[href="/khoa-hoc"]:visible').last()).toBeVisible();
    await expect(page.locator('a[href^="https://zalo.me/"]:visible').first()).toBeVisible();

    await expectNoHorizontalOverflow(page);
  });

  for (const route of ["/khoa-hoc", "/video", "/merch", "/lien-he"]) {
    test(`${route} stays within viewport on mobile`, async ({ page }) => {
      await page.goto(route);

      await expect(page.locator("body")).toBeVisible();
      await expect(page.locator("header button").first()).toBeVisible();
      await expectNoHorizontalOverflow(page);
    });
  }

  test("mobile menu opens and exposes key navigation links", async ({ page }) => {
    await page.goto("/");

    await page.locator("header button").first().click();
    await expect(page.locator('[data-slot="sheet-content"]')).toBeVisible();

    await expect(page.locator('[data-slot="sheet-content"] a[href="/"]').first()).toBeVisible();
    await expect(page.locator('[data-slot="sheet-content"] a[href="/khoa-hoc"]').first()).toBeVisible();
    await expect(page.locator('[data-slot="sheet-content"] a[href="/login"]').first()).toBeVisible();
  });
});
