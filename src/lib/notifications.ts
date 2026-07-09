export async function notifyNewComment(input: {
  postSlug: string;
  author: string;
  content: string;
}) {
  const webhookUrl = process.env.COMMENT_WEBHOOK_URL;

  if (!webhookUrl) {
    return;
  }

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      text: `New comment on /blog/${input.postSlug} from ${input.author}`,
      comment: input.content,
    }),
  }).catch(() => undefined);
}
