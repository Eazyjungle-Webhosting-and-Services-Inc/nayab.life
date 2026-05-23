# Deploying nayab.life on Plesk

This guide assumes Plesk with **Node.js** support enabled for the domain `nayab.life`.

## 1. DNS

Point the domain to your hosting and use nameservers:

- `ns1.bhootns3.com`
- `ns2.bhootns3.com`

## 2. Upload or clone the project

**Option A — Git (recommended)**

In Plesk → Git, connect repository:

```
https://github.com/bhootinsk/nayab.life.git
```

Deploy to the application root (e.g. `httpdocs` or a subdomain folder).

**Option B — Upload**

Upload the full project folder via File Manager or FTP.

## 3. Enable Node.js application

1. Plesk → **Domains** → `nayab.life` → **Node.js**
2. Set **Application root** to the project folder (where `app.js` lives)
3. Set **Application startup file** to `app.js`
4. Set **Application mode** to `production`
5. Click **NPM Install** (or run `npm install` in SSH)

## 4. Environment variables

In Node.js settings → **Environment variables**, add:

| Variable         | Example / notes                          |
|------------------|------------------------------------------|
| `NODE_ENV`       | `production`                             |
| `PORT`           | Use the port Plesk assigns (often auto)  |
| `SESSION_SECRET` | Long random string                       |
| `ADMIN_USERNAME` | Your admin username                      |
| `ADMIN_PASSWORD` | Strong password (change from default)    |

## 5. Writable directories

Ensure the web user can write to:

- `uploads/`
- `content/` (for CMS edits)
- `data/` (for site settings)

Typical permissions: `755` for folders, `644` for files; `uploads` may need `775` if uploads fail.

## 6. Static files (CSS & images)

The site serves `/css`, `/js`, and `/images` from the `public/` folder via Node.js.

After deploying, confirm these URLs load (not 404/503):

- `https://nayab.life/css/main.css?v=3`
- `https://nayab.life/images/custom/nayab-intro-banner.jpeg?v=4`
- `https://nayab.life/media/videos/intro-clip-1.mp4?v=4`

If static files fail, ensure the full repo (including `public/images/*.webp`) is deployed and restart the Node.js app. Images also have CDN fallbacks to voiceawareness.ca if local files are missing.

## 7. Start / restart the app

Use **Restart App** in the Node.js panel after each deploy or env change.

## 8. SSL

Enable **Let's Encrypt** SSL for `nayab.life` and `www.nayab.life` in Plesk.

## 9. Reverse proxy

Plesk usually proxies HTTPS to the Node.js port automatically. If the site does not load:

- Confirm Node.js is enabled for the domain
- Check application logs in Plesk → Node.js → Log files

## 10. Admin access

- URL: `https://nayab.life/admin` (use the same host every time — `www` or non-`www`, not both)
- Default login: `nayab_admin` / `NayabLife2025!` (see `data/admin.json` or env vars)
- Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `SESSION_SECRET` in Plesk Node.js environment variables
- If login loops back to the form: restart the app after deploy (session cookies require HTTPS proxy support, built into the app)

## 11. Backups

Back up regularly:

- `content/`
- `data/site.json`
- `uploads/`

## Troubleshooting

| Issue              | Action                                                |
|--------------------|-------------------------------------------------------|
| 502 Bad Gateway    | Restart Node.js app; verify `npm install` completed   |
| Upload fails       | Check `uploads/` permissions                          |
| CMS changes lost   | Ensure `content/` and `data/` are writable            |
| Session logout     | Set `SESSION_SECRET`; enable SSL in production        |
