import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "silas_blog_admin";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "silas-admin";
}

function getAdminSecret() {
  return process.env.ADMIN_SECRET ?? "change-this-secret-in-production";
}

function sign(value: string) {
  return createHmac("sha256", getAdminSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  return left.length === right.length && timingSafeEqual(left, right);
}

export function createAdminSession(password: string) {
  return sign(password);
}

export async function isAdminAuthenticated() {
  const session = (await cookies()).get(COOKIE_NAME)?.value;

  if (!session) {
    return false;
  }

  return safeEqual(session, createAdminSession(getAdminPassword()));
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function setAdminSession() {
  (await cookies()).set(COOKIE_NAME, createAdminSession(getAdminPassword()), {
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

export function verifyAdminPassword(password: string) {
  return safeEqual(password, getAdminPassword());
}
