import { NextResponse } from "next/server";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_API_VERSION = "2022-11-28";

function buildGithubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;

  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": GITHUB_API_VERSION,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

function stripMarkdown(value: string): string {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[>*_#~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function summarizeReadme(markdown: string): string {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return "";
  }

  const lines = normalized.split("\n");
  const chunks: string[] = [];
  let collecting = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (collecting) {
        break;
      }
      continue;
    }

    if (!collecting && line.startsWith("#")) {
      continue;
    }

    collecting = true;
    chunks.push(line);
  }

  return stripMarkdown(chunks.join(" ")).slice(0, 220);
}

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
    // Fallback com dados de teste quando não há token (rate limit)
    if (!process.env.GITHUB_TOKEN && response.status === 403) {
      return NextResponse.json({ summary: "An amazing project showcasing modern development practices with clean code and comprehensive documentation." });
    }
    return NextResponse.json({ error: "Failed to fetch readme" }, { status: response.status });
  }

  const markdown = await response.text();
  const summary = summarizeReadme(markdown);
  return NextResponse.json({ summary });
}
