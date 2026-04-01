import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchGithubRepoReadmeSummary,
  fetchGithubRepos,
  fetchGithubUser,
  GithubUserNotFoundError
} from "./github";

const mockFetch = vi.fn();

describe("github api client", () => {
  afterEach(() => {
    mockFetch.mockReset();
    vi.unstubAllGlobals();
  });

  it("throws domain not found error for 404 user", async () => {
    vi.stubGlobal("fetch", mockFetch.mockResolvedValue({ status: 404, ok: false }));
    await expect(fetchGithubUser("missing")).rejects.toBeInstanceOf(GithubUserNotFoundError);
  });

  it("parses user payload on success", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => ({
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
        })
      })
    );

    const result = await fetchGithubUser("octocat");
    expect(result.login).toBe("octocat");
  });

  it("parses repositories payload", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => [
          {
            id: 1,
            name: "repo",
            html_url: "https://github.com/octocat/repo",
            description: null,
            stargazers_count: 1,
            language: "TypeScript",
            updated_at: new Date().toISOString()
          }
        ]
      })
    );

    const result = await fetchGithubRepos("octocat");
    expect(result[0]?.name).toBe("repo");
  });

  it("returns empty readme summary on non-ok response", async () => {
    vi.stubGlobal("fetch", mockFetch.mockResolvedValue({ status: 500, ok: false }));
    const result = await fetchGithubRepoReadmeSummary("octocat", "repo");
    expect(result).toBe("");
  });
});
