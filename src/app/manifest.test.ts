import { describe, expect, it } from "vitest";
import manifest from "./manifest";

describe("manifest", () => {
  it("exposes the site as a standalone app", () => {
    expect(manifest()).toMatchObject({
      name: "Silas Blog",
      display: "standalone",
      start_url: "/",
    });
  });
});
