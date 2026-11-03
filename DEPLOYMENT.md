# Deployment (website)

Every push to `main` is checked (audit, type check, lint, build) and then deployed to the server over SSH by
`.github/workflows/deploy.yml`. The SSH settings are in that file; the secret values are in GitHub.

```
git push  →  GitHub Actions: audit, tsc, eslint, build  →  rsync over SSH to releases/<time>-<sha>
          →  remote-release.sh: switch `current` symlink, restart PM2, health check
          →  health check fails?  automatic rollback to the previous release
```

## 1. One-time server setup (Ubuntu/Debian)

```bash
# as root
adduser --disabled-password deploy
mkdir -p /var/www/truffles-web/releases && chown -R deploy:deploy /var/www/truffles-web
# Node 24, nginx, certbot, rsync, curl
npm install -g pm2
sudo -u deploy pm2 startup      # run the command it prints
```

Deploy key (on your own computer, dedicated to this purpose):

```bash
ssh-keygen -t ed25519 -f truffles_web_deploy -C "github-actions-truffles-web" -N ""
ssh-copy-id -i truffles_web_deploy.pub deploy@YOUR_SERVER
ssh-keyscan -p 22 YOUR_SERVER          # output = the SSH_KNOWN_HOSTS secret
```

nginx: copy `deploy/nginx.conf.example`, edit the domain, enable it, then
`sudo certbot --nginx -d your-domain -d www.your-domain`.
The site runs on `127.0.0.1:3000`; the website needs no secret `.env` on the server.

## 2. GitHub settings (repository → Settings → Secrets and variables → Actions)

| Type | Name | Value |
|---|---|---|
| Secret | `SSH_HOST` | server IP or hostname |
| Secret | `SSH_USER` | `deploy` |
| Secret | `SSH_PRIVATE_KEY` | full contents of `truffles_web_deploy` (the private file) |
| Secret | `SSH_KNOWN_HOSTS` | output of `ssh-keyscan` |
| Secret | `SSH_PORT` | optional, default 22 |
| Variable | `DEPLOY_PATH` | `/var/www/truffles-web` |
| Variable | `NEXT_PUBLIC_BACKEND_URL` | `https://api.your-domain` (https required; baked in at build time) |
| Variable | `NEXT_PUBLIC_SITE_URL` | `https://your-domain` |

The deployment fails on purpose if `NEXT_PUBLIC_BACKEND_URL` is missing. Until the SSH values exist the deploy
job skips itself with a notice. Optional: add required reviewers to a `production` environment.
The API's `CLIENT_URL` must equal the site's origin, or browsers will block the requests.

## 3. Day to day

* Push to `main` → deploys. Pull requests only run the checks.
* Manual rollback: `ln -sfn /var/www/truffles-web/releases/<older> /var/www/truffles-web/current && cd /var/www/truffles-web/current && pm2 startOrReload ecosystem.config.cjs`.
* Logs: `pm2 logs truffles-web`.
