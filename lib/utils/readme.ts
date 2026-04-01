// Removes common markdown syntax and keeps only readable plain text.
export function stripMarkdown(value: string): string {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[>*_#~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Converts README markdown into a short one-line summary for list display.
export function summarizeReadme(markdown: string): string {
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
