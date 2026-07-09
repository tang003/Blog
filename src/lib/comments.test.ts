import { describe, expect, it } from "vitest";
import { parseCommentFormData } from "./comments";

function form(values: Record<string, string>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }

  return formData;
}

describe("comment validation", () => {
  it("normalizes a valid comment", () => {
    expect(
      parseCommentFormData(
        form({
          author: " Silas ",
          email: "",
          content: " Nice post. ",
        }),
      ),
    ).toEqual({
      author: "Silas",
      email: null,
      content: "Nice post.",
    });
  });

  it("rejects honeypot spam and missing required fields", () => {
    expect(parseCommentFormData(form({ author: "A", content: "B", website: "bot" }))).toBeNull();
    expect(parseCommentFormData(form({ author: "", content: "B" }))).toBeNull();
    expect(parseCommentFormData(form({ author: "A", content: "" }))).toBeNull();
  });

  it("rejects overly long input", () => {
    expect(parseCommentFormData(form({ author: "a".repeat(41), content: "ok" }))).toBeNull();
    expect(
      parseCommentFormData(form({ author: "A", email: "a".repeat(121), content: "ok" })),
    ).toBeNull();
    expect(parseCommentFormData(form({ author: "A", content: "a".repeat(1001) }))).toBeNull();
  });
});
