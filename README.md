# nayab.life

A psychotherapy blog and content site for **Nayab Tahir**, Registered Psychotherapist (Ontario), associated with [Voice Awareness Psychotherapy Services Inc.](https://www.voiceawareness.ca).

## Stack

| App | Path | Purpose |
|-----|------|---------|
| **Next.js** | `apps/web` | Public website + admin UI (port 3000) |
| **NestJS** | `apps/api` | Content REST API (port 4000) |
| **Legacy Express** | `app.js` | Original EJS site (current Plesk production) |

Full architecture, folder layout, and editing workflow: **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**

## Quick start (Next.js + NestJS)

```bash
npm install
npm run sync:public          # copy public/ assets into apps/web/public
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run dev                  # API :4000 + Web :3000
```

- Site: http://localhost:3000  
- Admin: http://localhost:3000/admin/login  
- API: http://localhost:4000/api/site  

## Legacy Express (Plesk / transition)

```bash
cp .env.example .env
npm run legacy:start
```

Open http://localhost:3000 — includes EJS admin at `/admin`.

## Admin credentials (defaults)

| Field    | Value            |
|----------|------------------|
| Username | `nayab_admin`    |
| Password | `NayabLife2025!` |

Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `apps/api/.env` (new stack) or root `.env` (legacy).

## Content locations

| Path | Purpose |
|------|---------|
| `content/pages/` | About, services, approach |
| `content/posts/{blog,articles,news}/` | Posts |
| `data/site.json` | Contact info & links |
| `data/assets.json` | Image/video paths |
| `public/` | CSS, images, videos |
| `uploads/` | CMS uploads |

## Scripts

```bash
npm run dev          # Both apps
npm run dev:api      # NestJS only
npm run dev:web      # Next.js only
npm run build        # Production build
npm run sync:public  # Sync static assets to Next.js
npm run build:reel   # Local reel export (not deployed)
```

## Git remote

**Canonical repository:** `https://github.com/Eazyjungle-Webhosting-and-Services-Inc/nayab.life.git` (branch `main`).  
The old `bhootinsk/nayab.life` URL redirects here — see [docs/GIT.md](docs/GIT.md).

## Plesk deployment

See [docs/PLESK-DEPLOYMENT.md](docs/PLESK-DEPLOYMENT.md) for the current Express setup. Migrate to Next + Nest when ready using [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Owner

Nayab Tahir — Voice Awareness Psychotherapy Services Inc.

Private — all rights reserved.
