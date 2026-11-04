# erptek.net

Marketing site for **ERPTEK**: AI readiness, company second brains and agent assistants for small and mid-sized companies.

Built with [Astro](https://astro.build) (static output) and designed with the [Impeccable](https://github.com/pbakaus/impeccable) design skill. The skill is vendored in `.claude/skills/impeccable`, so Claude Code sessions in this repo have it as `/impeccable`.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run detect     # Impeccable anti-pattern detector over src/
```

## Configure

Copy `.env.example` to `.env`:

- `PUBLIC_FORM_ENDPOINT`: URL the booking forms POST JSON to (Formspree, Basin, a Cloudflare Worker and so on). If it's empty, the forms open an email draft instead.
- `PUBLIC_CONTACT_EMAIL`: shown in the footer and used for the email fallback (default `hello@erptek.net`).

## Deploy (Ubuntu VPS + Caddy, via GitHub Actions)

Every push to `main` runs `.github/workflows/deploy.yml`. It builds the site and rsyncs `dist/` into `/var/www/erptek/releases/<timestamp-sha>/` on the VPS. It then switches the `current` symlink in one atomic step and keeps the last 5 releases. To roll back, point `current` at an older release.

### One-time setup

1. **Make a deploy key pair** on your own computer (not on the VPS):
   ```bash
   ssh-keygen -t ed25519 -N "" -C "github-actions-deploy" -f erptek_deploy
   ```
2. **Set up the VPS.** Copy `deploy/setup-vps.sh` and `deploy/Caddyfile` to the server, then run:
   ```bash
   sudo bash setup-vps.sh "$(cat erptek_deploy.pub)"
   ```
   The script installs Caddy and rsync, creates a `deploy` user (key login only, no sudo) and prepares `/var/www/erptek`. It also installs the Caddyfile and opens ports 80 and 443 if ufw is active. At the end it prints the host key line for `VPS_KNOWN_HOSTS`.
3. **Point DNS.** Create A records for `erptek.net` and `www.erptek.net` with the VPS IP. Caddy issues the HTTPS certificates automatically.
4. **Add GitHub repository secrets** (Settings → Secrets and variables → Actions → Secrets):
   - `VPS_HOST`: server IP or hostname
   - `VPS_USER`: `deploy`
   - `VPS_SSH_KEY`: the contents of the private key file `erptek_deploy`
   - `VPS_KNOWN_HOSTS` (recommended): the line printed by the setup script, with `<host>` replaced by the value of `VPS_HOST`. Without it, the workflow trusts whatever host key it sees at deploy time.
   - `VPS_PORT` (optional): only if SSH doesn't listen on port 22
5. **Optional repository variables** (same page → Variables): `PUBLIC_FORM_ENDPOINT`, `PUBLIC_CONTACT_EMAIL`.
6. **Deploy.** Push to `main`, or open Actions → Deploy → Run workflow.

Changing `deploy/Caddyfile` later doesn't redeploy it automatically. Copy it to `/etc/caddy/Caddyfile` and run `sudo systemctl reload caddy`.

## Structure

- `src/pages/index.astro`: home page, assembled from `src/components/*`
- `src/components/Hero.astro`: headline, booking strip, and the interactive rack demo (put-away, then pick)
- `src/components/Readiness.astro`: 8-question readiness self-check that runs in the browser
- `src/styles/global.css`: design tokens (cool concrete, ink, safety yellow, rack blue and orange) and shared controls
- `PRODUCT.md`: product truth used by Impeccable
- `.impeccable/surfaces/`: the home page's direction contract

## Before launch: content to replace or confirm

- **Contact email** `hello@erptek.net` is a placeholder.
- **Booking endpoint**: set `PUBLIC_FORM_ENDPOINT`.
- The **hero rack demo** (bins, file names, Q&A) is illustrative data for a fictional company and is labeled "Demo data" on the page.
- The **FAQ answers** (data handling, vendor lock-in, no ERP replacement) state commitments. Confirm they match how ERPTEK works.
- No case studies, testimonials, team bios or metrics have been invented. Add real ones when they exist.
- **Logo**: the current mark is a typeset wordmark.
