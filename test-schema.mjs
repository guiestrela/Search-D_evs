import { z } from 'zod';

const githubUserSchema = z.object({
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
  public_repos: z.number().nonnegative()
});

const testData = {
  login: "torvalds",
  id: 12345,
  avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
  html_url: "https://github.com/torvalds",
  name: "Torvalds",
  email: "torvalds@example.com",
  location: "São Paulo, Brazil",
  bio: "Developer | Test Account",
  company: "Dev Company",
  blog: "https://example.com",
  twitter_username: "torvalds",
  followers: 100,
  following: 50,
  public_repos: 5
};

try {
  const result = githubUserSchema.parse(testData);
  console.log('✓ Validation passed:', result);
} catch (error) {
  console.error('✗ Validation failed:', error.message);
}
