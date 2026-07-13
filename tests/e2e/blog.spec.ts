import { expect, test } from "@playwright/test";

test("public pages render", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "记录技术、项目和一些长期有用的想法。",
    }),
  ).toBeVisible();

  await page.goto("/blog/first-post");
  await expect(
    page.getByRole("heading", {
      name: "第一篇博客：把个人站先跑起来",
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "评论" })).toBeVisible();
});

test("search page works", async ({ page }) => {
  await page.goto("/search?q=Docker");
  await expect(page.getByRole("heading", { name: "搜索文章" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Docker" })).toBeVisible();
});

test("admin entrypoint is hidden behind the private studio path", async ({ page, request }) => {
  const directAdmin = await request.get("/admin");
  expect(directAdmin.status()).toBe(404);

  const directAdminApi = await request.post("/api/admin/uploads", {
    multipart: {
      file: {
        name: "test.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("test"),
      },
    },
  });
  expect(directAdminApi.status()).toBe(404);

  const studioApi = await request.post("/studio-api/uploads", {
    multipart: {
      file: {
        name: "test.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("test"),
      },
    },
  });
  expect(studioApi.status()).toBe(401);

  await page.goto("/tang");
  await expect(page).toHaveURL(/\/tang\/login/);
  await expect(page.getByRole("heading", { name: "管理员登录" })).toBeVisible();
});

test("admin editor previews uploaded images", async ({ page }) => {
  await page.goto("/tang/login");
  await page.getByLabel("账号").fill("admin");
  await page.getByLabel("密码").fill("silas-admin");
  await page.getByRole("button", { name: "登录" }).click();
  await expect(page).toHaveURL(/\/tang$/);

  await page.goto("/tang/new");
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: "preview.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/atXq9kAAAAASUVORK5CYII=",
      "base64",
    ),
  });

  await expect(page.getByText("preview.png")).toBeVisible();
  await expect(page.locator('textarea[name="content"]')).toHaveValue(
    /!\[preview\]\(\/uploads\/.+\.png\)/,
  );
  await expect(page.locator('img[src^="/uploads/"]').first()).toBeVisible();
});

test("health endpoints are available", async ({ request }) => {
  await expect((await request.get("/api/health")).ok()).toBe(true);
  await expect((await request.get("/api/ready")).ok()).toBe(true);
});
