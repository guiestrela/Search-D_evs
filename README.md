# Developer Search Challenge

Technical test application built with React, Next.js, and TypeScript.

## Requirements covered

- React framework with Next.js App Router
- Chakra UI v2 for UI components
- Source code written in English
- Internationalized text using i18next (`en` and `pt`)
- Two routes:
	- `/home` for user search
	- `/profile/[username]` for shareable profile links
- Entities modeled with Zod:
	- GitHub user schema
	- GitHub repository schema

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Run locally

```bash
npm install
npm run dev
```

## Secure GitHub API setup

To avoid exposing credentials in the browser, this project uses internal server routes under `/api/github/*`.

If you want higher GitHub API limits, create a `.env.local` file at the project root:

```bash
GITHUB_TOKEN=your_github_token_here
```

Notes:

- Keep `GITHUB_TOKEN` only in `.env.local` (never in client code).
- Do not commit `.env.local`.
- Without token, requests still work but are subject to lower anonymous rate limits.

## Main files

- `app/home/page.tsx`
- `app/profile/[username]/page.tsx`
- `lib/i18n.ts`
- `lib/schemas/github.ts`
- `lib/api/github.ts`
