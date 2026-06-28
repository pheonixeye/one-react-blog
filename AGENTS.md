# AGENTS.md

## Project Overview
Next.js 15 + React 19 + TypeScript blog app (SSG/static export) with PocketBase and Tailwind CSS v4. i18n via URL params (`/ar/`, `/en/`). Default locale: Arabic.

## Commands
| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server on port 3000, host 0.0.0.0 |
| `npm run build` | Static export to `out/` via `next build` |
| `npm run start` | Start production server |
| `npm run typecheck` | Type-check (`tsc --noEmit`) |
| `npm run clean` | Remove `.next/` and `out/` |

## Environment Variables
Copy `.env.example` to `.env.local` and set:
- `APP_URL` - Production URL for sitemap/robots (default: `https://blog.proklinik.app`)
- `POCKETBASE_URL` - PocketBase instance URL (default: `http://127.0.0.1:8090`)

## Architecture
- **Entry**: `src/app/[locale]/layout.tsx` - root layout per locale, sets `lang`/`dir`, renders Nav + main + Footer
- **Pages (SSG)**: `src/app/[locale]/page.tsx` (home, all articles), `src/app/[locale]/[category]/page.tsx` (filtered list), `src/app/[locale]/article/[id]/page.tsx` (article detail)
- **Components**: `src/components/Nav.tsx`, `Footer.tsx`, `ArticleCard.tsx`, `ArticleDetail.tsx`, `BlogContent.tsx`
- **Data**: `src/lib/articles.ts` reads JSON files from `src/data/` at build time
- **i18n**: `src/lib/i18n.ts` / `src/messages/index.ts` - simple key lookup by locale
- **PocketBase**: `src/lib/pocketbase.ts` - client-side only for form submissions (SSG-safe)

## Key Conventions
- Path alias `@/*` maps to `src/` (see `tsconfig.json`)
- Static export with `next.config.ts`: `output: 'export'`, `trailingSlash: true`
- i18n via URL path segment (`/[locale]/...`), not next-intl. Locale is passed as prop to all client components
- All pages use `generateStaticParams` for SSG. Data is read at build time from JSON files
- No test framework, no ESLint/Prettier - only TypeScript type-checking via `npm run typecheck`
- Tailwind v4 via `@tailwindcss/postcss` + `postcss.config.mjs`

## Data
Static articles in `src/data/`:
- `articles.json` - list of article summaries
- `article1.json` through `article5.json` - individual articles with content

## Routes
- `/{locale}/` - All articles (home)
- `/{locale}/{category}` - Filtered by category (product, engineering, operations, culture)
- `/{locale}/article/{id}` - Article detail

## Locales
- `ar` (default, RTL) and `en` (LTR)
- Language toggle in Nav switches locale cookie and navigates to same page in other locale
- Both locales are pre-generated at build time for all routes

## Deployment
- Deployed on **Cloudflare Pages** (connected repo; auto-builds on push to `main`)
- **Build command**: `npm run build`  |  **Output dir**: `out/`
- **Env var** in Cloudflare dashboard: `APP_URL` = `https://blog.proklinik.app`
- **Root redirect** via `public/_redirects`: `/` → `/ar/` (301). Only 301/302 redirects (no 200 rewrites — they break MIME types on custom domains).
- **MIME types** enforced by `public/_headers` for `_next/static` JS and CSS files to prevent `X-Content-Type-Options: nosniff` errors on custom domains.
- `.github/workflows/build.yml` runs CI build on push/PR (does not deploy; Cloudflare handles that).
- GitHub Actions does not need `wrangler` or an API token — Cloudflare Pages is connected directly via the dashboard.

## Gotchas
- `npm run lint` is `next lint` (no ESLint config yet); type-check with `npm run typecheck` instead
- PocketBase is only used in client-side form handlers (demo/quote requests). Static build does not require it
- No React Router, hash-based routing, or next-intl - plain URL path-based routing with App Router
- `process.cwd()` in `src/lib/articles.ts` resolves to project root at build time (not browser)
- All images from `lh3.googleusercontent.com` are allowed via `remotePatterns` in next.config