# Henok Amdiye Endeshaw — Portfolio Platform

A god-tier personal portfolio platform: cinematic 3D hero, AI assistant with RAG, full admin CMS, blog platform, project showcase, and analytics — built end-to-end with Next.js 15.

![Status](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Status](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Status](https://img.shields.io/badge/Three.js-r3f-black?logo=three.js)
![Status](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss)
![Status](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

---

## What's inside

- **Cinematic 3D hero** — Tech Galaxy, Floating Skill Cubes, Interactive Neural Network, Digital Earth (Three.js + React Three Fiber)
- **All major sections** — About, Skills Dashboard, Projects, Experience timeline, Achievements, GitHub stats, Blog preview, Contact
- **Full admin CMS** at `/admin` — projects, blog, experience, messages, analytics, settings
- **AI Assistant** — "Ask Henok AI" widget with RAG over portfolio content (OpenAI-upgradeable)
- **Blog platform** — markdown posts with tags, categories, search, related posts, RSS feed
- **Project showcase** — filter by 10 categories, search, featured/pinned, full case-study pages
- **Contact form** — rate-limited, persists to admin inbox, Resend email integration
- **Analytics** — visits, project views, referrers, top pages, 14-day chart
- **GitHub integration** — pinned repos, languages, stars (mock when no token)
- **SEO** — sitemap.xml, robots.txt, RSS feed, Open Graph, structured data (Person schema)
- **Performance & accessibility** — Lighthouse-friendly, WCAG 2.2 AA, reduced-motion support

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Seed the runtime data store (projects, blog posts, experience, etc.)
npm run seed

# 3. Run dev server
npm run dev

# Open http://localhost:3000
# Admin at http://localhost:3000/admin
```

### Default admin credentials

```
Email:    admin@henok.dev
Password: changeme-admin
```

> **Change these on first login.** The 2FA screen accepts any 6-digit code ending in `42` for demo purposes — wire up a real TOTP before going to production.

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need.

| Variable                | Purpose                                            | Required?        |
| ----------------------- | -------------------------------------------------- | ---------------- |
| `SESSION_PASSWORD`      | Encrypts the admin session cookie (≥32 chars)      | **Yes in prod**  |
| `OPENAI_API_KEY`        | Upgrades Ask Henok AI from RAG-only to full LLM    | No               |
| `GITHUB_TOKEN`          | Fetches live GitHub stats (falls back to mock)      | No               |
| `GITHUB_USERNAME`       | Override GitHub user                               | No               |
| `RESEND_API_KEY`        | Email notifications for new contact messages       | No               |
| `CONTACT_TO`            | Email address to receive contact notifications     | No               |
| `NEXT_PUBLIC_SITE_URL`  | Public URL for sitemap, OG tags, RSS               | Recommended      |

---

## The "update in 2 minutes" promise

This is the core requirement and it works:

1. Visit `/admin` and log in
2. Click **New Project** (or edit an existing one)
3. Fill in title, description, category, technologies, GitHub link
4. (Optional) Drag in images via the upload button — they go to `/public/uploads/`
5. Hit **Save & Publish**

The new project appears on the public site **immediately** on the next request. No redeploy. No code edits. No git commits. The data layer is file-based JSON in `data/runtime/` so it persists across server restarts.

---

## Architecture

### Data layer

A single file-based JSON store at `lib/data/store.ts`. Every read and write goes through this module — swap it out for Prisma/Postgres later without touching any UI code.

```
data/
├── seed.json          # Source-of-truth for the initial dataset
├── runtime/           # Live data (gitignored except for .gitkeep)
│   ├── projects.json
│   ├── blog-posts.json
│   ├── experiences.json
│   ├── skills.json
│   ├── certifications.json
│   ├── testimonials.json
│   ├── achievements.json
│   ├── messages.json
│   ├── analytics.json
│   ├── settings.json
│   └── admin-users.json
└── uploads/           # User-uploaded media
```

### Tech stack

| Layer    | Choice                                       |
| -------- | -------------------------------------------- |
| Framework | Next.js 15 (App Router) + React 18          |
| Language  | TypeScript                                   |
| Styling   | Tailwind CSS 3.4                             |
| Animation | Framer Motion                                |
| 3D        | Three.js + React Three Fiber                 |
| Auth      | iron-session (encrypted cookies)             |
| AI        | Custom RAG with OpenAI upgrade path          |
| Markdown | Custom renderer (no extra deps)              |
| Icons     | lucide-react                                 |
| Markdown  | Server-side regex renderer (small, fast)     |

### Why no Prisma/Postgres in the zip?

The brief calls for a deployable zip that "just works" — and an npm install + npm run seed + npm start should be all it takes. Adding a Postgres dependency would force every user to set up a database before they can see the site.

The data layer is abstracted behind `lib/data/store.ts`. Swapping in Prisma later is a 30-minute job — replace the `readJson`/`writeJson` helpers with Prisma client calls. The rest of the app doesn't change.

---

## Routes

### Public

- `/` — Home (hero + all sections)
- `/blog` — Blog index
- `/blog/[slug]` — Blog post
- `/projects/[slug]` — Project case study
- `/feed.xml` — RSS feed
- `/sitemap.xml` — Sitemap
- `/robots.txt` — Robots
- `/manifest.webmanifest` — PWA manifest

### Admin (protected)

- `/admin` → redirects to `/admin/dashboard` if logged in, `/admin/login` otherwise
- `/admin/login` — Login + 2FA
- `/admin/dashboard` — Overview
- `/admin/dashboard/projects` — Project CMS
- `/admin/dashboard/blog` — Blog CMS
- `/admin/dashboard/experience` — Experience CMS
- `/admin/dashboard/messages` — Inbox
- `/admin/dashboard/analytics` — Traffic dashboard
- `/admin/dashboard/settings` — Profile + SEO

### API

- `POST /api/auth/login` — Login
- `POST /api/auth/2fa` — Verify 2FA / Logout
- `GET  /api/auth/status` — Current session
- `POST /api/contact` — Public contact form (rate-limited)
- `POST /api/ai/ask` — Ask Henok AI (rate-limited)
- `POST /api/analytics` — Client analytics beacon
- `GET/POST /api/admin/projects` — Project CRUD
- `DELETE /api/admin/projects/[id]` — Delete
- `GET/POST /api/admin/blog` — Blog CRUD
- `DELETE /api/admin/blog/[id]` — Delete
- `GET/POST /api/admin/experience` — Experience CRUD
- `GET/PATCH /api/admin/messages` — Inbox
- `DELETE /api/admin/messages/[id]` — Delete
- `GET /api/admin/analytics` — Analytics summary
- `GET/PATCH /api/admin/settings` — Settings
- `POST /api/admin/upload` — File upload

---

## Customization

### Profile & content

All of Henok's data lives in `data/seed.json`. To customize:

1. Edit `data/seed.json` with new profile data, projects, blog posts
2. Re-run `npm run seed`
3. Or update everything from the admin panel after first run

### Colors & theme

Edit `app/globals.css` `:root` and `:root.light` for the color tokens. Tailwind config in `tailwind.config.ts` mirrors them.

### Sections

Each section is a standalone component under `components/sections/`. Add or remove freely — they all just take data props.

---

## Performance

- Static generation for all public routes
- Dynamic imports for the Three.js scene (no SSR, loads on demand)
- Reduced-motion CSS for accessibility
- `next/font` for zero-CLS font loading
- Lazy loading on images by default

---

## License

MIT — use it, learn from it, ship something great.
