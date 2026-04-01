import { githubReposSchema, githubUserSchema, type GithubRepo, type GithubUser } from "../schemas/github";

const INTERNAL_GITHUB_API_BASE = "/api/github/users";

// Domain error used by UI to render a not-found state instead of generic failure.
export class GithubUserNotFoundError extends Error {
  constructor() {
    super("Github user not found");
    this.name = "GithubUserNotFoundError";
  }
}

// Requests and validates one GitHub user through the app's internal API route.
export async function fetchGithubUser(username: string): Promise<GithubUser> {
  const response = await fetch(`${INTERNAL_GITHUB_API_BASE}/${encodeURIComponent(username)}`, {
    cache: "no-store"
  });

  if (response.status === 404) {
    throw new GithubUserNotFoundError();
  }

  if (!response.ok) {
    throw new Error("Failed to fetch github user");
  }

  const json = await response.json();
  return githubUserSchema.parse(json);
}

// Requests and validates the repository list for a given GitHub user.
export async function fetchGithubRepos(username: string): Promise<GithubRepo[]> {
  const response = await fetch(`${INTERNAL_GITHUB_API_BASE}/${encodeURIComponent(username)}/repos`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch github repos");
  }

  const json = await response.json();
  return githubReposSchema.parse(json);
}

// Retrieves one preprocessed README summary, returning empty text if unavailable.
export async function fetchGithubRepoReadmeSummary(username: string, repo: string): Promise<string> {
  const response = await fetch(
    `${INTERNAL_GITHUB_API_BASE}/${encodeURIComponent(username)}/repos/${encodeURIComponent(repo)}/readme-summary`,
    {
      cache: "no-store"
    }
  );

  if (!response.ok) {
    return "";
  }

  const json = (await response.json()) as { summary?: unknown };
  return typeof json.summary === "string" ? json.summary : "";
}
