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
    // Se não houver token válido, retorna dados de teste
    const token = process.env.GITHUB_TOKEN?.trim();
    if (!token || token === "COLE_SEU_TOKEN_AQUI") {
      return NextResponse.json({
        login: username,
        id: 12345,
        avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
        html_url: `https://github.com/${username}`,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        email: `${username}@example.com`,
        location: "São Paulo, Brazil",
        bio: "Developer | Test Account",
        company: "Dev Company",
        blog: "https://example.com",
        twitter_username: username,
        followers: 100,
        following: 50,
        public_repos: 5
      });
    }
    return NextResponse.json({ error: "Failed to fetch github user" }, { status: response.status });
  }

  const user = await response.json();
  return NextResponse.json(user);
}
