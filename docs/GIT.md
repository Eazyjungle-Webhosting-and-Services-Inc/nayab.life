# Git repository

## Canonical remote (use this for clone, push, and Plesk)

```
https://github.com/Eazyjungle-Webhosting-and-Services-Inc/nayab.life.git
```

Branch: `main`

The previous URL `https://github.com/bhootinsk/nayab.life.git` redirects here. Local `origin` should point at Eazyjungle (updated March 2026).

## First-time setup

```bash
git clone https://github.com/Eazyjungle-Webhosting-and-Services-Inc/nayab.life.git
cd nayab.life
```

## Fix an old clone still using bhootinsk

```bash
git remote set-url origin https://github.com/Eazyjungle-Webhosting-and-Services-Inc/nayab.life.git
git remote -v
git push origin main
```

## Deploy after push

See [PLESK-DEPLOYMENT.md](PLESK-DEPLOYMENT.md): pull → deploy to Node app root → restart → verify `/deploy-check`.
