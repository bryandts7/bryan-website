# bryan-website

Personal website of Bryan Delton Tawarikh Sibarani: about me, experience, projects, blog and the Bahasa Unang translator.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 with the typography plugin
- Markdown posts rendered with `react-markdown`, KaTeX (math) and Mermaid (diagrams)
- Deployed on Netlify (`netlify.toml`)

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
| `src/app` | Routes: `/`, `/experiences`, `/portfolio`, `/portfolio/[id]`, `/blogs`, `/blog/[id]`, `/translator` |
| `src/components` | Shared UI (navbar, footer, blog renderer, project cards, translator) |
| `src/data` | Blog posts, projects and experience (to be moved into a database) |
| `src/assets`, `src/fonts` | Images and the Pixelify Sans font |
