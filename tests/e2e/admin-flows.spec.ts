import "dotenv/config";
import { AdminStatus } from "@prisma/client";
import { expect, test, type Page } from "@playwright/test";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/security/password";

const seededAdmin = {
  identifier: "admin",
  defaultPassword: "admin",
  updatedPassword: "Admin@123456",
};

let currentAdminPassword = seededAdmin.defaultPassword;

async function resetAdminAccount() {
  const passwordHash = await hashPassword(seededAdmin.defaultPassword);

  await prisma.adminUser.updateMany({
    where: {
      OR: [{ username: seededAdmin.identifier }, { email: process.env.SEED_ADMIN_EMAIL ?? "dinh5609@gmail.com" }],
    },
    data: {
      passwordHash,
      mustChangePassword: true,
      failedLoginAttempts: 0,
      lastFailedLoginAt: null,
      lockUntil: null,
      status: AdminStatus.ACTIVE,
    },
  });

  currentAdminPassword = seededAdmin.defaultPassword;
}

async function trySignIn(page: Page, password: string) {
  await page.goto("/login");

  if (/\/(admin\/dashboard|change-password)$/.test(page.url())) {
    return "session" as const;
  }

  await expect(page.locator("#identifier")).toBeVisible({ timeout: 8_000 });
  await page.locator("#identifier").fill(seededAdmin.identifier);
  await page.locator("#password").fill(password);
  await page.locator("form").first().locator('button[type="submit"]').click();

  try {
    await expect(page).toHaveURL(/\/(admin\/dashboard|change-password)$/, { timeout: 8_000 });
    return true;
  } catch {
    return false;
  }
}

async function completeForcedPasswordChange(page: Page, candidatePasswords: string[]) {
  for (const password of candidatePasswords) {
    await page.locator("#currentPassword").fill(password);
    await page.locator("#newPassword").fill(seededAdmin.updatedPassword);
    await page.locator("#confirmPassword").fill(seededAdmin.updatedPassword);
    await page.locator("form").first().locator('button[type="submit"]').click();

    try {
      await expect(page).toHaveURL(/\/admin\/dashboard$/, { timeout: 8_000 });
      currentAdminPassword = seededAdmin.updatedPassword;
      return;
    } catch {
      // Try the next known password on the same forced-change screen.
    }
  }

  throw new Error("Could not complete forced password change with known passwords.");
}

async function loginAsAdmin(page: Page, options?: { expectForceChange?: boolean }) {
  const candidatePasswords = Array.from(
    new Set([currentAdminPassword, seededAdmin.updatedPassword, seededAdmin.defaultPassword]),
  );

  let authenticatedWith: string | null = null;

  for (const password of candidatePasswords) {
    const result = await trySignIn(page, password);

    if (result) {
      authenticatedWith = password;
      currentAdminPassword = password;
      break;
    }
  }

  if (!authenticatedWith) {
    throw new Error("Admin sign-in failed with all known passwords.");
  }

  if (authenticatedWith === seededAdmin.defaultPassword) {
    await page.waitForTimeout(1_000);
  }

  const redirectedToPasswordChange = /\/change-password$/.test(page.url());

  if (options?.expectForceChange && authenticatedWith === seededAdmin.defaultPassword) {
    await expect(page).toHaveURL(/\/change-password$/);
  }

  if (redirectedToPasswordChange) {
    await completeForcedPasswordChange(page, candidatePasswords);
  }

  await expect(page).toHaveURL(/\/admin\/dashboard$/);
}

async function logoutAdmin(page: Page) {
  await page.locator("header").getByRole("button").last().click();
  await expect(page).toHaveURL(/\/$/, { timeout: 20_000 });
}

test.describe.serial("admin auth and core CMS flows", () => {
  test.beforeEach(async () => {
    await resetAdminAccount();
  });

  test("admin is redirected to login, forced to change password, then can sign in again", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/login/);

    await loginAsAdmin(page, { expectForceChange: true });
    await expect(page).toHaveURL(/\/admin\/dashboard$/);

    await logoutAdmin(page);

    await loginAsAdmin(page);
    await expect(page).toHaveURL(/\/admin\/dashboard$/);
  });

  test("admin can create, edit, and delete a course", async ({ page }) => {
    const title = `Playwright Course ${Date.now()}`;
    const updatedDescription = "Cap nhat mo ta khoa hoc tu Playwright";

    await loginAsAdmin(page);
    await page.goto("/admin/courses");

    await page.locator("#title").fill(title);
    await page.locator("#category").fill("Kiem thu");
    await page.locator("#level").fill("Co ban");
    await page.locator("#format").fill("Video");
    await page.locator("#shortDescription").fill("Mo ta ngan cho khoa hoc test");
    await page.locator("#longDescription").fill("Noi dung chi tiet cho khoa hoc duoc tao boi Playwright.");
    await page.locator("#priceLabel").fill("499.000đ");
    await page.locator("#durationLabel").fill("8 buoi");

    await Promise.all([
      page.waitForURL(/\/admin\/courses$/, { timeout: 20_000 }),
      page.locator("form").first().locator('button[type="submit"]').click(),
    ]);

    const row = page.locator("tbody tr", { hasText: title });
    await expect(row).toBeVisible();

    await row.locator('a[href*="/admin/courses?edit="]').click();
    await expect(page).toHaveURL(/\/admin\/courses\?edit=/);

    await page.locator("#shortDescription").fill(updatedDescription);

    await page.locator("form").first().locator('button[type="submit"]').click();
    await page.waitForTimeout(1_000);
    await page.goto("/admin/courses");

    await expect(page.locator("tbody tr", { hasText: title })).toBeVisible();

    const updatedRow = page.locator("tbody tr", { hasText: title });
    await updatedRow.locator("form button").click();
    await expect(page.locator("tbody tr", { hasText: title })).toHaveCount(0);
  });

  test("admin core pages render after sign in", async ({ page }) => {
    const routes = [
      "/admin/settings",
      "/admin/landing",
      "/admin/testimonials",
      "/admin/media",
      "/admin/profile",
    ];

    await loginAsAdmin(page);

    for (const route of routes) {
      await page.goto(route);
      await expect(page).toHaveURL(new RegExp(`${route.replace(/\//g, "\\/")}$`));
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("main").locator("h1, h2").first()).toBeVisible();
    }
  });

  test("admin can create, edit, and delete a product", async ({ page }) => {
    const title = `Playwright Merch ${Date.now()}`;

    await loginAsAdmin(page);
    await page.goto("/admin/products");

    await page.locator("#title").fill(title);
    await page.locator("#category").fill("Ao");
    await page.locator("#material").fill("Cotton");
    await page.locator("#variantText").fill("Size M");
    await page.locator("#shortDescription").fill("Merch test duoc tao boi Playwright");
    await page.locator("#longDescription").fill("San pham dung de kiem thu luong CRUD cua admin.");
    await page.locator("#price").fill("199000");
    await page.locator("#compareAtPrice").fill("249000");

    await Promise.all([
      page.waitForURL(/\/admin\/products$/, { timeout: 20_000 }),
      page.locator("form").first().locator('button[type="submit"]').click(),
    ]);

    const row = page.locator("tbody tr", { hasText: title });
    await expect(row).toBeVisible();

    await row.locator('a[href*="/admin/products?edit="]').click();
    await expect(page).toHaveURL(/\/admin\/products\?edit=/);

    await page.locator("#variantText").fill("Size L");

    await page.locator("form").first().locator('button[type="submit"]').click();
    await page.waitForTimeout(1_000);
    await page.goto("/admin/products");

    const updatedRow = page.locator("tbody tr", { hasText: title });
    await expect(updatedRow).toBeVisible();

    await updatedRow.locator("form button").click();
    await expect(page.locator("tbody tr", { hasText: title })).toHaveCount(0);
  });

  test("admin can create, edit, and delete a video", async ({ page }) => {
    const title = `Playwright Video ${Date.now()}`;
    const updatedDuration = "14 phut";

    await loginAsAdmin(page);
    await page.goto("/admin/videos");

    await page.locator("#title").fill(title);
    await page.locator("#youtubeUrl").fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await page.locator("#shortDescription").fill("Video test duoc tao boi Playwright");
    await page.locator("#durationLabel").fill("12 phut");

    await Promise.all([
      page.waitForURL(/\/admin\/videos$/, { timeout: 20_000 }),
      page.locator("form").first().locator('button[type="submit"]').click(),
    ]);

    const row = page.locator("tbody tr", { hasText: title });
    await expect(row).toBeVisible();

    await row.locator('a[href*="/admin/videos?edit="]').click();
    await expect(page).toHaveURL(/\/admin\/videos\?edit=/);

    await page.locator("#durationLabel").fill(updatedDuration);

    await page.locator("form").first().locator('button[type="submit"]').click();
    await expect.poll(() => page.url(), { timeout: 20_000 }).toMatch(/\/admin\/videos$/);

    const updatedRow = page.locator("tbody tr", { hasText: title });
    await expect(updatedRow).toContainText(updatedDuration);

    await updatedRow.locator("form button").click();
    await expect(page.locator("tbody tr", { hasText: title })).toHaveCount(0);
  });

  test("admin can create, edit, and delete an FAQ item", async ({ page }) => {
    const question = `Playwright FAQ ${Date.now()} co can dang nhap khong?`;
    const updatedAnswer = "Khong can tai khoan user de xem noi dung public.";

    await loginAsAdmin(page);
    await page.goto("/admin/faq");

    await page.locator("#question").fill(question);
    await page.locator("#category").fill("Playwright");
    await page.locator("#answer").fill("Cau tra loi ban dau cho muc FAQ duoc tao tu E2E.");

    await Promise.all([
      page.waitForURL(/\/admin\/faq$/, { timeout: 20_000 }),
      page.locator("form").first().locator('button[type="submit"]').click(),
    ]);

    const row = page.locator("tbody tr", { hasText: question });
    await expect(row).toBeVisible();

    await row.locator('a[href*="/admin/faq?edit="]').click();
    await expect(page).toHaveURL(/\/admin\/faq\?edit=/);

    await page.locator("#answer").fill(updatedAnswer);

    await page.locator("form").first().locator('button[type="submit"]').click();
    await page.waitForTimeout(1_000);
    await page.goto("/admin/faq");

    const updatedRow = page.locator("tbody tr", { hasText: question });
    await expect(updatedRow).toBeVisible();

    await updatedRow.locator("form button").click();
    await expect(page.locator("tbody tr", { hasText: question })).toHaveCount(0);
  });
});
