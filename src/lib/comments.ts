export type CommentInput = {
  author: string;
  email: string | null;
  content: string;
};

export function parseCommentFormData(formData: FormData): CommentInput | null {
  const author = String(formData.get("author") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();

  if (website || !author || !content) {
    return null;
  }

  if (author.length > 40 || email.length > 120 || content.length > 1000) {
    return null;
  }

  return {
    author,
    email: email || null,
    content,
  };
}

export function shouldModerateComments() {
  return process.env.COMMENT_MODERATION === "true";
}
