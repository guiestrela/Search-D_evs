import { describe, expect, it } from "vitest";
import { buildXProfileUrl, extractLinkedInUrl, normalizeTwitterHandle } from "./profile";

describe("profile utils", () => {
  it("extracts LinkedIn url from blog first", () => {
    const result = extractLinkedInUrl("https://www.linkedin.com/in/test-user", "bio text");
    expect(result).toBe("https://www.linkedin.com/in/test-user");
  });

  it("extracts LinkedIn url from bio when blog has no LinkedIn", () => {
    const result = extractLinkedInUrl(
      "https://myblog.dev",
      "Find me at https://www.linkedin.com/company/acme-inc for details"
    );
    expect(result).toBe("https://www.linkedin.com/company/acme-inc");
  });

  it("normalizes twitter handles with @ and spaces", () => {
    expect(normalizeTwitterHandle(" @dev_user ")).toBe("dev_user");
  });

  it("builds X profile url from twitter handle", () => {
    expect(buildXProfileUrl("@torvalds")).toBe("https://x.com/torvalds");
  });
});
