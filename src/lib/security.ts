import { prisma } from "@/lib/prisma";

const LOGIN_WINDOW_MINUTES = 15;
const LOGIN_MAX_FAILURES = 5;
const COMMENT_WINDOW_MINUTES = 10;
const COMMENT_MAX_ATTEMPTS = 3;

function since(minutes: number) {
  return new Date(Date.now() - minutes * 60 * 1000);
}

export async function isLoginLocked(identifier: string) {
  const failures = await prisma.loginAttempt.count({
    where: {
      identifier,
      success: false,
      createdAt: { gte: since(LOGIN_WINDOW_MINUTES) },
    },
  });

  return failures >= LOGIN_MAX_FAILURES;
}

export async function recordLoginAttempt(identifier: string, success: boolean) {
  await prisma.loginAttempt.create({
    data: { identifier, success },
  });
}

export async function isCommentRateLimited(identifier: string) {
  const attempts = await prisma.comment.count({
    where: {
      OR: [{ email: identifier }, { author: identifier }],
      createdAt: { gte: since(COMMENT_WINDOW_MINUTES) },
    },
  });

  return attempts >= COMMENT_MAX_ATTEMPTS;
}

export function hasBlockedWords(content: string) {
  const words = (process.env.COMMENT_BLOCKLIST ?? "")
    .split(",")
    .map((word) => word.trim().toLowerCase())
    .filter(Boolean);

  if (words.length === 0) {
    return false;
  }

  const normalized = content.toLowerCase();
  return words.some((word) => normalized.includes(word));
}
