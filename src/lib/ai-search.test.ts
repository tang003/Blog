import { describe, expect, it } from "vitest";
import { chunkText } from "./ai-search";

describe("AI document indexing", () => {
  it("normalizes and chunks content", () => {
    const chunks = chunkText(`Title

${"a".repeat(1300)}`);

    expect(chunks).toHaveLength(2);
    expect(chunks[0].startsWith("Title")).toBe(true);
    expect(chunks[0].length).toBeLessThanOrEqual(1200);
  });
});
