# Server Deployment Runbook

Last updated: 2026-05-30

This runbook records the first server upload/deployment path for the Iran Autism app and the repeatable update flow for future changes.

## Server Access

- SSH user: `mehdi`
- SSH IP: `5.160.71.62`
- SSH command: `ssh mehdi@5.160.71.62`
- Server panel host mentioned by server admin: `panel.irautism.org`
- Server OS observed during setup: Ubuntu 24.04.2 LTS
- Server private network address observed by Nginx/Next output: `192.168.113.2`
- Public preview URL used for this deployment: `http://5.160.71.62/fa`

Do not commit passwords or private keys. The SSH/server password was stored locally on the project owner's Mac in macOS Keychain under service name `iranautism-server-panel`, account `mehdi`.

## Domains

- Main domain confirmed by project owner: `https://irautism.org`
- Existing production website currently uses the main domain, so the new app was deployed for preview by direct server IP.
- DNS lookup on 2026-05-30 showed `irautism.org`, `www.irautism.org`, and `panel.irautism.org` resolving to proxy/CDN IPs `185.143.233.234` and `185.143.234.234`, not directly to `5.160.71.62`.
- Before moving this app onto a real domain, ask the server/domain owner to confirm which hostname should point to this app and whether the proxy/CDN origin is `5.160.71.62`.

## Repository

- GitHub repository: `https://github.com/mahdi7596/iranautism-app`
- Server checkout path: `/var/www/iranautism-app`
- Branch deployed: `main`
- GitHub access from the server was tested successfully with:

```bash
git ls-remote https://github.com/mahdi7596/iranautism-app.git HEAD
```

## Installed Runtime

The first deployment used direct server installation, not Docker.

- Node.js: NodeSource Node 22
- Package manager: `pnpm@10.30.1` through Corepack
- Database: PostgreSQL 16
- Cache/queue backend: Redis 7
- Reverse proxy: Nginx 1.24
- Process manager: systemd

Docker was skipped because the repository did not contain production Dockerfiles. The repository `compose.yaml` is only a local development Postgres/Redis helper.

## Apt Proxy Note

Initial `apt update` and package installs failed because apt was forced through an unreachable proxy:

```text
192.168.0.55:10808
```

The broken apt proxy file was disabled:

```bash
sudo mv /etc/apt/apt.conf.d/90curtin-aptproxy /etc/apt/apt.conf.d/90curtin-aptproxy.disabled
sudo apt update
```

This restored direct access to Ubuntu package repositories.

## Server Paths And Secrets

- App root: `/var/www/iranautism-app`
- API env file: `/var/www/iranautism-app/apps/api/.env`
- Web env file: `/var/www/iranautism-app/apps/web/.env.production`
- Generated database password file on server: `/home/mehdi/.iranautism-db-password`
- API service: `iranautism-api`
- Web service: `iranautism-web`
- Nginx site: `/etc/nginx/sites-available/iranautism-app`

The server env files are intentionally not committed. Real Sadad and SMS credentials must be added only to server-side environment files or a server secret store, never to git.

## Database

Production database and user created during first deployment:

- Database: `iranautism_prod`
- Database user: `iranautism_app`
- Host/port: `localhost:5432`

Migrations were applied with:

```bash
cd /var/www/iranautism-app
set -a
. apps/api/.env
set +a
pnpm --filter @iranautism/api db:generate
pnpm --filter @iranautism/api exec prisma migrate deploy
```

## Nginx Routing

Nginx proxies:

- `/api/` to `http://127.0.0.1:3001`
- `/health` to `http://127.0.0.1:3001`
- `/` to `http://127.0.0.1:3000`

The configured `server_name` values are:

```nginx
server_name 5.160.71.62 panel.irautism.org irautism.org www.irautism.org;
```

Local routing checks:

```bash
curl -I http://127.0.0.1
curl -s http://127.0.0.1/health
```

Expected health response:

```json
{"status":"ok","service":"iranautism-api"}
```

## Future Update Flow

Use this flow after changes are committed and pushed to GitHub.

1. SSH into the server:

```bash
ssh mehdi@5.160.71.62
```

2. Pull latest code:

```bash
cd /var/www/iranautism-app
git pull origin main
```

3. Install any new dependencies:

```bash
pnpm install --frozen-lockfile
```

If pnpm warns about ignored build scripts for trusted dependencies, run:

```bash
pnpm approve-builds
```

4. Load environment variables:

```bash
set -a
. apps/api/.env
. apps/web/.env.production
set +a
```

5. Generate Prisma client and apply migrations:

```bash
pnpm --filter @iranautism/api db:generate
pnpm --filter @iranautism/api exec prisma migrate deploy
```

6. Build:

```bash
pnpm build
```

If only the API changed and a fast deploy is needed:

```bash
pnpm --filter @iranautism/api build
```

If web env values changed, rebuild the web app too because `NEXT_PUBLIC_*` values are embedded at build time.

7. Restart services:

```bash
sudo systemctl restart iranautism-api iranautism-web
```

8. Verify services:

```bash
sudo systemctl status iranautism-api --no-pager
sudo systemctl status iranautism-web --no-pager
curl -s http://127.0.0.1/health
curl -I http://127.0.0.1
```

9. Verify public preview:

```bash
curl -I http://5.160.71.62
curl -s http://5.160.71.62/health
```

Open:

```text
http://5.160.71.62/fa
```

## Useful Logs

```bash
sudo journalctl -u iranautism-api -n 100 --no-pager
sudo journalctl -u iranautism-web -n 100 --no-pager
sudo nginx -t
sudo systemctl status nginx --no-pager
```

## First Deployment Notes

- First public preview went live on 2026-05-30 at `http://5.160.71.62/fa`.
- A production startup bug in `AuthTokenService` was found during deployment and fixed in commit `483c8d4` (`Fix AuthTokenService production startup`).
- The API and web services were confirmed active after the fix.
- The direct IP preview uses `http://5.160.71.62` in server env files until a final hostname is assigned.

