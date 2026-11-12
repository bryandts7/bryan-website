# bryan-website

Personal website of Bryan Delton Tawarikh Sibarani: about me, experience, projects, a blog with comments, and the Bahasa Unang translator. Content is edited in the admin console at `/admin`.

## Stack

- Next.js 16 (App Router, Cache Components) + React 19 + TypeScript
- Tailwind CSS 4 with the typography plugin; follows the visitor's light/dark setting
- Supabase: Postgres (posts, projects, experience, About-me text, comments), Auth (GitHub and Google sign-in), Storage (images)
- Markdown with KaTeX (math) and Mermaid (diagrams)
- Deployed on Netlify (`netlify.toml`)

## Setup

Create `.env.local` (never committed) with the project's public values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_SITE_URL=https://bryandts.netlify.app
```

The same variables must be set in Netlify. The database schema and access rules are in `supabase/migrations/0001_init.sql` (run once in the Supabase SQL Editor). Admin rights are given in the SQL Editor only:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

## Commands

```bash
npm install     # install dependencies
npm run dev     # local dev server on http://localhost:3000
npm run build   # production build
npm run lint    # ESLint
```

## Layout

| Path | What it holds |
|---|---|
| `src/app` | Public pages, `/admin`, `/login`, sitemap, robots, RSS (`/feed.xml`), link-preview images |
| `src/app/admin/actions.ts`, `src/app/comments/actions.ts` | Every write; each checks the caller before the database checks again |
| `src/components` | Shared UI; `admin/` for the console, `comments/` for the comment thread |
| `src/lib` | Supabase clients, cached content readers, auth helpers, dates, site settings |
| `supabase/migrations` | Database schema, row-level security, storage bucket |
