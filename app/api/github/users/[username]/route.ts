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

// Proxies user profile requests to GitHub and keeps fallback data for local study/demo.
export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;

  if (!username?.trim()) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  const response = await fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`, {
    cache: "no-store",
    headers: buildGithubHeaders()
  });

  if (response.status === 404) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch github user" }, { status: response.status });
  }

  const user = await response.json();
  return NextResponse.json(user);
}
