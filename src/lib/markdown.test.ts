import { describe, expect, it } from "vitest";
import { extractToc, slugifyHeading } from "./markdown";

describe("markdown helpers", () => {
  it("creates stable slugs for English and Chinese headings", () => {
    expect(slugifyHeading("Hello, Next.js!")).toBe("hello-next-js");
    expect(slugifyHeading("关于这个博客")).toBe("关于这个博客");
  });

  it("extracts h2 and h3 headings with duplicate ids", () => {
    expect(
      extractToc(`
# Title
## Intro
### Details
## Intro
#### Ignored
`),
    ).toEqual([
      { id: "intro", level: 2, text: "Intro" },
      { id: "details", level: 3, text: "Details" },
      { id: "intro-2", level: 2, text: "Intro" },
    ]);
  });
});
