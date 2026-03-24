import { expect, test } from "@playwright/test";

test("landing page renders core public navigation and CTA paths", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: /Xem khóa học/i }).first()).toBeVisible();
  await expect(page.locator('a[href="/merch"]').first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Xem liên hệ/i })).toBeVisible();
});

test("course and merch pages expose tracked CTA links", async ({ page }) => {
  await page.goto("/khoa-hoc");
  await expect(page.getByRole("link", { name: /Đăng ký ngay/i })).toHaveAttribute("href", /\/api\/cta\?/);

  await page.goto("/merch");
  await expect(page.getByRole("link", { name: /Mua merch/i }).first()).toHaveAttribute("href", /\/api\/cta\?/);
});
