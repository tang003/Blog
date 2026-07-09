import { expect, test } from "@playwright/test";

test("public pages render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "记录技术、项目和一些长期有用的想法。" })).toBeVisible();

  await page.goto("/blog/first-post");
  await expect(page.getByRole("heading", { name: "第一篇博客：把个人站先跑起来" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "评论" })).toBeVisible();
});

test("search page works", async ({ page }) => {
  await page.goto("/search?q=Docker");
  await expect(page.getByRole("heading", { name: "搜索文章" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Docker" })).toBeVisible();
});

test("admin is protected", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole("heading", { name: "管理员登录" })).toBeVisible();
});

test("health endpoints are available", async ({ request }) => {
  await expect((await request.get("/api/health")).ok()).toBe(true);
  await expect((await request.get("/api/ready")).ok()).toBe(true);
});
