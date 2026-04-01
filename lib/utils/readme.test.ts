import { describe, expect, it } from "vitest";
import { stripMarkdown, summarizeReadme } from "./readme";

describe("readme utils", () => {
  it("removes common markdown syntax", () => {
    const result = stripMarkdown("## Title with [link](https://example.com) and `code`");
    expect(result).toBe("Title with link and code");
  });

  it("summarizes first content paragraph after title", () => {
    const markdown = "# My Project\n\nA simple **awesome** project for tests.\n\n## Details\nMore text";
    const result = summarizeReadme(markdown);
    expect(result).toBe("A simple awesome project for tests.");
  });

  it("returns empty summary when readme is empty", () => {
    expect(summarizeReadme("\n\n")).toBe("");
  });
});
