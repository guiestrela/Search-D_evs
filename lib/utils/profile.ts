// Extracts a LinkedIn URL from profile fields, prioritizing the blog field.
export function extractLinkedInUrl(blog?: string | null, bio?: string | null): string | null {
  if (blog && blog.includes("linkedin.com")) {
    return blog;
  }

  if (!bio) {
    return null;
  }

  const linkedInMatch = bio.match(/(https?:\/\/(?:www\.)?linkedin\.com\/(?:in|company)\/[^\s]+)/i);
  return linkedInMatch ? linkedInMatch[0] : null;
}

// Normalizes GitHub twitter_username to a clean handle without "@" and spaces.
export function normalizeTwitterHandle(twitterUsername?: string | null): string | null {
  if (!twitterUsername) {
    return null;
  }

  const normalized = twitterUsername.trim().replace(/^@+/, "");
  return normalized || null;
}

// Builds the X (Twitter) profile URL when a valid handle exists.
export function buildXProfileUrl(twitterUsername?: string | null): string | null {
  const handle = normalizeTwitterHandle(twitterUsername);
  return handle ? `https://x.com/${handle}` : null;
}
