# ProKlinik Blog

A bilingual (Arabic/English) static blog for **ProKlinik**, built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Fully statically exported to deploy on **Cloudflare Pages**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, SSG) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 via PostCSS |
| Icons | lucide-react |
| Data | Static JSON files in `src/data/` |
| i18n | Custom key-lookup (no next-intl) |
| Backend (forms) | PocketBase (client-side only) |
| Deployment | Cloudflare Pages (static export) |

## Routes

| URL | Content |
|-----|---------|
| `/{locale}/` | Home — all articles |
| `/{locale}/{category}` | Filtered by category |
| `/{locale}/article/{id}` | Article detail |
| `/sitemap.xml` | Sitemap (auto-generated) |
| `/robots.txt` | Robots (auto-generated) |

**Locales:** `ar` (Arabic, RTL, default) and `en` (English, LTR)

## Getting Started

```bash
npm install       # install dependencies
npm run dev       # dev server on http://0.0.0.0:3000
npm run build     # static export to out/
npm run start     # production server
npm run typecheck # TypeScript check (tsc --noEmit)
```

Set environment variables in `.env.local` (see `.env.example`):

- `APP_URL` — production URL for sitemap/robots (default: `https://blog.proklinik.app`)
- `POCKETBASE_URL` — PocketBase instance URL for form submissions (default: `http://127.0.0.1:8090`)

## Architecture

```
src/
├── app/
│   ├── [locale]/          # locale-driven pages (SSG)
│   │   ├── layout.tsx     # root layout per locale (lang, dir, Nav, Footer)
│   │   ├── page.tsx       # home — all articles
│   │   ├── [category]/
│   │   │   └── page.tsx   # filtered by category
│   │   └── article/
│   │       └── [id]/
│   │           └── page.tsx # article detail
│   ├── robots.ts          # robots.txt (build-time)
│   ├── sitemap.ts         # sitemap.xml (build-time)
│   ├── globals.css        # Tailwind entry
│   └── layout.tsx         # root layout (HTML shell)
├── components/
│   ├── ArticleCard.tsx
│   ├── ArticleDetail.tsx
│   ├── BlogContent.tsx
│   ├── Footer.tsx
│   ├── LocaleProvider.tsx
│   └── Nav.tsx
├── data/                  # static article JSON files
│   ├── articles.json      # article index
│   └── article1-5.json    # full article content
├── lib/
│   ├── articles.ts        # data loader (reads JSON at build time)
│   ├── i18n.ts            # translation helpers
│   ├── pocketbase.ts      # client-side PocketBase (SSG-safe)
│   └── types.ts           # shared TypeScript types
└── messages/
    └── index.ts           # i18n key-value pairs
```

## Internationalization (i18n)

- Locale is derived from the URL path segment `/:locale/...`.
- A `LocaleProvider` cookie persists the user's choice across sessions.
- The Nav includes a language toggle that moves between `/ar/...` and `/en/...`.
- Both locales are pre-rendered at build time via `generateStaticParams`.

## Data Model

Articles are stored as static JSON files in `src/data/`. At build time `src/lib/articles.ts` reads them from disk and returns typed objects. Categories include: `product`, `engineering`, `operations`, `culture`.

## Redirect Rules (Cloudflare Pages)

The `public/_redirects` file handles URL normalization:

- `/` → `/ar/` (301)
- `/en/*` → served directly (200 rewrite)
- `/ar/*` → served directly (200 rewrite)
- `/*` (no locale) → `/ar/*` (301)

## Deployment

The project is deployed on **Cloudflare Pages** (connected directly to the GitHub repo).

### Dashboard Settings

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `out/` |
| Environment variable | `APP_URL` = `https://blog.proklinik.app` |

### CI

A lightweight GitHub Actions workflow (`.github/workflows/build.yml`) runs `npm run build` on every push/PR to `main` as a validation step. Cloudflare Pages handles the actual deployment automatically.

## Notes

- No test framework or ESLint — type checking with `tsc --noEmit` is the only verification.
- PocketBase is used only in client-side form handlers (demo/quote requests) — the static build does not require it.
- Image optimization is disabled (`unoptimized: true`) for static export; remote images from `lh3.googleusercontent.com` are allowed.
- `trailingSlash: true` ensures consistent URL formatting.
