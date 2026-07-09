"use server";

import { revalidatePath } from "next/cache";
import { parseCommentFormData, shouldModerateComments } from "@/lib/comments";
import { notifyNewComment } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { hasBlockedWords, isCommentRateLimited } from "@/lib/security";

export async function createCommentAction(postId: string, slug: string, formData: FormData) {
  const comment = parseCommentFormData(formData);

  if (!comment) {
    return;
  }

  const identifier = comment.email ?? comment.author;

  if (await isCommentRateLimited(identifier)) {
    return;
  }

  await prisma.comment.create({
    data: {
      postId,
      ...comment,
      approved: !shouldModerateComments() && !hasBlockedWords(comment.content),
    },
  });

  await notifyNewComment({
    postSlug: slug,
    author: comment.author,
    content: comment.content,
  });

  revalidatePath(`/blog/${slug}`);
}
