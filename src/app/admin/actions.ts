"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  requireAdmin,
  setAdminSession,
  verifyAdminCredentials,
} from "@/lib/auth";
import { getAdminPath } from "@/lib/admin-path";
import { prisma } from "@/lib/prisma";
import { normalizePostInput } from "@/lib/posts";
import { isLoginLocked, recordLoginAttempt } from "@/lib/security";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "admin").trim() || "admin";
  const password = String(formData.get("password") ?? "");
  const identifier = username.toLowerCase();

  if (await isLoginLocked(identifier)) {
    redirect(`${getAdminPath("/login")}?locked=1`);
  }

  if (!verifyAdminCredentials(username, password)) {
    await recordLoginAttempt(identifier, false);
    redirect(`${getAdminPath("/login")}?error=1`);
  }

  await recordLoginAttempt(identifier, true);
  await setAdminSession(username);
  redirect(getAdminPath());
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/");
}

export async function createPostAction(formData: FormData) {
  await requireAdmin();
  const input = normalizePostInput(formData);
  const now = new Date();

  try {
    const post = await prisma.post.create({
      data: {
        ...input,
        publishedAt: input.published ? now : null,
      },
      select: { id: true },
    });

    redirect(getAdminPath(`/${post.id}/edit`));
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirect(`${getAdminPath("/new")}?error=slug`);
    }

    throw error;
  }
}

export async function updatePostAction(id: string, formData: FormData) {
  await requireAdmin();
  const input = normalizePostInput(formData);
  const existing = await prisma.post.findUnique({
    where: { id },
    select: { published: true, publishedAt: true },
  });

  if (!existing) {
    redirect(getAdminPath());
  }

  try {
    await prisma.post.update({
      where: { id },
      data: {
        ...input,
        publishedAt:
          input.published && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
    });

    redirect(`${getAdminPath(`/${id}/edit`)}?saved=1`);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirect(`${getAdminPath(`/${id}/edit`)}?error=slug`);
    }

    throw error;
  }
}

export async function deletePostAction(id: string) {
  await requireAdmin();

  await prisma.post.delete({
    where: { id },
  });

  redirect(getAdminPath());
}

export async function deleteCommentAction(id: string) {
  await requireAdmin();

  await prisma.comment.delete({
    where: { id },
  });

  redirect(getAdminPath("/comments"));
}

export async function toggleCommentApprovalAction(id: string, approved: boolean) {
  await requireAdmin();

  await prisma.comment.update({
    where: { id },
    data: { approved: !approved },
  });

  redirect(getAdminPath("/comments"));
}
