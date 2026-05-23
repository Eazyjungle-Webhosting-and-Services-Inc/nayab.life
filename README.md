# nayab.life

A Node.js blog and content site for **Nayab Tahir**, Registered Psychotherapist (Ontario), associated with [Voice Awareness Psychotherapy Services Inc.](https://www.voiceawareness.ca).

## Features

- Public website: home, about, services, approach, contact
- Blog, articles, and news sections
- Admin CMS at `/admin` for editing pages, posts, and media
- JSON-based content storage (easy to back up on Plesk)
- Markdown support for posts and pages
- Media upload library

## Quick start (local)

```bash
npm install
cp .env.example .env
npm start
```

Open http://localhost:3000

## Admin CMS credentials (public defaults)

| Field    | Value            |
|----------|------------------|
| URL      | `/admin`         |
| Username | `nayab_admin`    |
| Password | `NayabLife2025!` |

**Change these in production** by setting `ADMIN_USERNAME` and `ADMIN_PASSWORD` in your `.env` file on the server.

## Project structure

```
app.js              # Entry point
routes/             # Public & admin routes
views/              # EJS templates
public/             # CSS, JS, static images
content/            # Pages & posts (JSON)
data/site.json      # Site settings
uploads/            # Uploaded media
```

## Plesk deployment

See [docs/PLESK-DEPLOYMENT.md](docs/PLESK-DEPLOYMENT.md).

## Domain & DNS

- Domain: **nayab.life**
- Nameservers: `ns1.bhootns3.com`, `ns2.bhootns3.com`

## Owner

Nayab Tahir — Voice Awareness Psychotherapy Services Inc.

## License

Private — all rights reserved.
