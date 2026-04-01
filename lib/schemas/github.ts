import { z } from "zod";

export const githubUserSchema = z.object({
  login: z.string(),
  avatar_url: z.string().url(),
  html_url: z.string().url(),
  name: z.string().nullable(),
  bio: z.string().nullable(),
  company: z.string().nullable(),
  location: z.string().nullable(),
  email: z.string().nullable(),
  blog: z.string().nullable(),
  twitter_username: z.string().nullable(),
  followers: z.number().nonnegative(),
  following: z.number().nonnegative(),
  public_repos: z.number().nonnegative(),
  public_gists: z.number().nonnegative().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  hireable: z.boolean().nullable().optional()
});

export const githubRepoSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  html_url: z.string().url(),
  description: z.string().nullable(),
  stargazers_count: z.number().nonnegative(),
  language: z.string().nullable(),
  updated_at: z.string()
});

export const githubReposSchema = z.array(githubRepoSchema);

export type GithubUser = z.infer<typeof githubUserSchema>;
export type GithubRepo = z.infer<typeof githubRepoSchema>;
