import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("health route", () => {
  it("returns a live response", async () => {
    const response = GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.service).toBe("blog-silas");
  });
});
