"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  requireAdmin,
  setAdminSession,
  verifyAdminPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizePostInput } from "@/lib/posts";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminPassword(password)) {
    redirect("/admin/login?error=1");
  }

  await setAdminSession();
  redirect("/admin");
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

    redirect(`/admin/${post.id}/edit`);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirect("/admin/new?error=slug");
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
    redirect("/admin");
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

    redirect(`/admin/${id}/edit?saved=1`);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirect(`/admin/${id}/edit?error=slug`);
    }

    throw error;
  }
}

export async function deletePostAction(id: string) {
  await requireAdmin();

  await prisma.post.delete({
    where: { id },
  });

  redirect("/admin");
}
