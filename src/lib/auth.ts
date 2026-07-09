import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "silas_blog_admin";
const DEV_PASSWORD = "silas-admin";
const DEV_USERNAME = "admin";
const DEV_SECRET = "change-this-secret-in-production";
const INSECURE_SECRETS = new Set([
  DEV_SECRET,
  "replace-with-a-long-random-secret",
]);

function isLocalSite() {
  const siteUrl = process.env.SITE_URL ?? "";
  return siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1");
}

function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD ?? DEV_PASSWORD;

  if (
    process.env.NODE_ENV === "production" &&
    !isLocalSite() &&
    password === DEV_PASSWORD
  ) {
    throw new Error("ADMIN_PASSWORD must be changed in production.");
  }

  return password;
}

function getAdminUsers() {
  const users = process.env.ADMIN_USERS;

  if (!users) {
    return [{ username: DEV_USERNAME, password: getAdminPassword() }];
  }

  return users
    .split(",")
    .map((item) => {
      const [username, password] = item.split(":");
      return {
        username: username?.trim(),
        password: password?.trim(),
      };
    })
    .filter(
      (user): user is { username: string; password: string } =>
        Boolean(user.username && user.password),
    );
}

function getAdminSecret() {
  const secret = process.env.ADMIN_SECRET ?? DEV_SECRET;

  if (
    process.env.NODE_ENV === "production" &&
    !isLocalSite() &&
    INSECURE_SECRETS.has(secret)
  ) {
    throw new Error("ADMIN_SECRET must be changed in production.");
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getAdminSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  return left.length === right.length && timingSafeEqual(left, right);
}

export function createAdminSession(username: string, password: string) {
  return sign(`${username}:${password}`);
}

export async function isAdminAuthenticated() {
  const session = (await cookies()).get(COOKIE_NAME)?.value;

  if (!session) {
    return false;
  }

  return getAdminUsers().some((user) =>
    safeEqual(session, createAdminSession(user.username, user.password)),
  );
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function setAdminSession(username = DEV_USERNAME) {
  const user = getAdminUsers().find((item) => item.username === username) ?? getAdminUsers()[0];

  (await cookies()).set(COOKIE_NAME, createAdminSession(user.username, user.password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export function verifyAdminPassword(password: string, username = DEV_USERNAME) {
  const users = getAdminUsers();
  const matchingUser = users.find((user) => user.username === username) ?? users[0];

  return safeEqual(password, matchingUser.password);
}

export function verifyAdminCredentials(username: string, password: string) {
  return getAdminUsers().some(
    (user) => user.username === username && safeEqual(password, user.password),
  );
}
