import { describe, expect, it } from "vitest";
import { githubReposSchema, githubUserSchema } from "./github";

describe("github schemas", () => {
  it("validates minimal user payload", () => {
    const parsed = githubUserSchema.parse({
      login: "octocat",
      avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
      html_url: "https://github.com/octocat",
      name: null,
      bio: null,
      company: null,
      location: null,
      email: null,
      blog: null,
      twitter_username: null,
      followers: 10,
      following: 2,
      public_repos: 5
    });

    expect(parsed.login).toBe("octocat");
  });

  it("rejects invalid user url", () => {
    expect(() =>
      githubUserSchema.parse({
        login: "octocat",
        avatar_url: "not-url",
        html_url: "https://github.com/octocat",
        name: null,
        bio: null,
        company: null,
        location: null,
        email: null,
        blog: null,
        twitter_username: null,
        followers: 10,
        following: 2,
        public_repos: 5
      })
    ).toThrow();
  });

  it("validates repo array payload", () => {
    const parsed = githubReposSchema.parse([
      {
        id: 1,
        name: "repo",
        html_url: "https://github.com/octocat/repo",
        description: null,
        stargazers_count: 1,
        language: "TypeScript",
        updated_at: new Date().toISOString()
      }
    ]);

    expect(parsed).toHaveLength(1);
  });
});
