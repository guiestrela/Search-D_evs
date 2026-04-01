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

  const response = await fetch(
    `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?sort=updated`,
    {
      cache: "no-store",
      headers: buildGithubHeaders()
    }
  );

  if (!response.ok) {
    // Se não houver token válido, retorna dados de teste
    const token = process.env.GITHUB_TOKEN?.trim();
    if (!token || token === "COLE_SEU_TOKEN_AQUI") {
      return NextResponse.json([
        {
          id: 1,
          name: "project-one",
          description: "First test project with amazing features",
          html_url: "https://github.com/example/project-one",
          stargazers_count: 42,
          language: "TypeScript",
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: "project-two",
          description: "Second project demonstrating capabilities",
          html_url: "https://github.com/example/project-two",
          stargazers_count: 17,
          language: "JavaScript",
          updated_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 3,
          name: "project-three",
          description: "Third project showcasing interface design",
          html_url: "https://github.com/example/project-three",
          stargazers_count: 8,
          language: "Python",
          updated_at: new Date(Date.now() - 172800000).toISOString()
        }
      ]);
    }
    return NextResponse.json({ error: "Failed to fetch github repos" }, { status: response.status });
  }

  const repos = await response.json();
  return NextResponse.json(repos);
}
