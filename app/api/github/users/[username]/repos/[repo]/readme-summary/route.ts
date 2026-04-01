import { NextResponse } from "next/server";
import { summarizeReadme } from "@/lib/utils/readme";

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

// Reads a repository README, summarizes it and returns compact text for UI cards.
export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string; repo: string }> }
) {
  const { username, repo } = await context.params;

  if (!username?.trim() || !repo?.trim()) {
    return NextResponse.json({ error: "Username and repo are required" }, { status: 400 });
  }

  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${encodeURIComponent(username)}/${encodeURIComponent(repo)}/readme`,
    {
      cache: "no-store",
      headers: {
        ...buildGithubHeaders(),
        Accept: "application/vnd.github.raw+json"
      }
    }
  );

  if (response.status === 404) {
    return NextResponse.json({ summary: "" });
  }

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch readme" }, { status: response.status });
  }

  const markdown = await response.text();
  const summary = summarizeReadme(markdown);
  return NextResponse.json({ summary });
}
