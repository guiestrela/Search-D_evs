import { NextResponse } from "next/server";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_API_VERSION = "2022-11-28";

// Builds shared GitHub API headers and optionally injects authentication.
function buildGithubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;

  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": GITHUB_API_VERSION,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// Proxies repository list requests and returns fallback repos when unauthenticated.
export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;

  if (!username?.trim()) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  const response = await fetch(
    `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?sort=updated`,
    {
      cache: "no-store",
      headers: buildGithubHeaders()
    }
  );

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch github repos" }, { status: response.status });
  }

  const repos = await response.json();
  return NextResponse.json(repos);
}
