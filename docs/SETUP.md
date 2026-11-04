# ERPTEK site: configuration guide

This guide covers every setting the site needs, in the order to do them. Each part links to its detailed guide where one exists.

| # | What | Where | Status |
|---|---|---|---|
| 1 | Leads Google Sheet | Google Drive | **Done**: "ERPTEK leads" with a `Leads` tab and headers |
| 2 | Apps Script web app (sheet + email) | Sheet → Extensions → Apps Script | To do |
| 3 | Cloudflare Turnstile (captcha) | Cloudflare dashboard | To do |
| 4 | Site environment variables | Build environment | To do |
| 5 | Build and deploy | Your production setup | Yours |
| 6 | Live check | erptek.net | To do |
| 7 | Content to confirm before launch | Repo | To do |

---

## 1. Leads Google Sheet (done)

The sheet **ERPTEK leads** is in the Google Drive of hnquocbao@gmail.com. It has one tab named `Leads`, with these headers in row 1:

`Received (UTC) | Form | Name | Email | Company | Company size | Notes | Readiness score | Page`

Don't rename the tab or reorder the columns: the script writes to the `Leads` tab in this order. If the tab is ever missing, the script creates it with the headers.

## 2. Apps Script web app

Code: [`integrations/google-sheets/Code.gs`](../integrations/google-sheets/Code.gs). Details: [`integrations/google-sheets/README.md`](../integrations/google-sheets/README.md).

1. Open the sheet, then **Extensions → Apps Script**.
2. Delete the editor contents, paste in all of `Code.gs`, and save (Ctrl/Cmd+S). Optionally name the project "ERPTEK leads".
3. **Project Settings** (gear icon) → **Script properties** → add:

   | Property | Value | Required |
   |---|---|---|
   | `NOTIFY_EMAIL` | Address that receives lead emails, e.g. `hnquocbao@gmail.com`. Separate several addresses with commas. | Optional (defaults to the script owner) |
   | `TURNSTILE_SECRET` | Turnstile **secret** key from step 3 | Yes, for the captcha |
   | `ALLOWED_HOSTNAMES` | `erptek.net,www.erptek.net` | Recommended |

   While `TURNSTILE_SECRET` is empty, the script accepts submissions without a captcha. Set it before going live.
4. In the editor's function menu, choose **`testSetup`** → **Run**. Google asks for permission to edit the spreadsheet, send email and connect to external services. Choose Advanced → "Go to … (unsafe)" if Google shows the unverified-app screen; that's normal for your own script.
   - Expected: a test row appears in `Leads` and an email titled "New ERPTEK lead: Test lead" arrives.
   - Delete the test row afterwards.
5. **Deploy → New deployment** → type **Web app**:
   - Description: `erptek leads v1`
   - Execute as: **Me**
   - Who has access: **Anyone** (visitors aren't signed in to Google)

   Copy the **Web app URL**. It looks like `https://script.google.com/macros/s/AKfy…/exec`.
6. Optional check: open that URL in a browser. It should show `{"ok":true,"service":"erptek-leads"}`.

**Updating the script later:** paste the new code, then **Deploy → Manage deployments → ✎ edit → Version: New version → Deploy**. The URL stays the same. Don't use "New deployment", because that creates a different URL.

**Troubleshooting:** Apps Script → **Executions** lists every request with its errors. Free Gmail accounts can send about 100 script emails a day; Google Workspace accounts about 1,500.

## 3. Cloudflare Turnstile (captcha)

1. Go to https://dash.cloudflare.com → **Turnstile** → **Add widget**. It's free and doesn't require the domain to be on Cloudflare.
2. Widget name: `erptek.net`. Hostnames: `erptek.net` and `www.erptek.net`, plus `localhost` if you want to test locally with real keys. Widget mode: **Managed**. Pre-clearance: **No**.
3. Copy both keys:
   - **Site key** (public) → `PUBLIC_TURNSTILE_SITE_KEY` in step 4
   - **Secret key** → `TURNSTILE_SECRET` in the Apps Script (step 2.3). Never put it in the site or the repo.

The site renders the widget in "interaction-only" mode: most visitors never see it, and it only shows a checkbox when Cloudflare is unsure. Cloudflare's test keys, for development only:

| Purpose | Site key | Secret key |
|---|---|---|
| Always passes | `1x00000000000000000000AA` | `1x0000000000000000000000000000000AA` |
| Always fails | `2x00000000000000000000AB` | `2x0000000000000000000000000000000AA` |

## 4. Site environment variables

These are **build-time** values: Astro bakes them into the static files, so rebuild after any change. Locally, copy `.env.example` to `.env`. In production, set them wherever your build runs.

| Variable | Value | Effect when empty |
|---|---|---|
| `PUBLIC_FORM_ENDPOINT` | The Apps Script `/exec` URL from step 2.5 | Forms open the visitor's email app instead |
| `PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key from step 3 | No captcha (the honeypot and server-side checks still apply) |
| `PUBLIC_CONTACT_EMAIL` | The public contact address shown in the footer and the booking section | Shows the placeholder `hello@erptek.net` |

All three are public by design (the `PUBLIC_` prefix). No secrets belong in the site build.

If you build with the included GitHub Actions workflow (`.github/workflows/deploy.yml`), set them as repository **Variables** (Settings → Secrets and variables → Actions → Variables). The VPS deployment through that workflow is optional: [README → Deploy](../README.md#deploy-ubuntu-vps--caddy-via-github-actions). It runs on every push to `main`, so disable it in the Actions tab if you deploy another way.

## 5. Build and deploy

```bash
npm ci
npm test          # 14 tests: Apps Script logic + both forms in a browser
npm run build     # output in dist/
```

Publish `dist/` the way your production setup does. If you serve it with Caddy, [`deploy/Caddyfile`](../deploy/Caddyfile) is a ready config with HTTPS, security headers, asset caching, the 404 page and the www → apex redirect.

## 6. Live check (do this once)

The dev box couldn't reach Google or Cloudflare, so the integration has been tested with local stand-ins only. This check is the real end-to-end test.

1. Open https://erptek.net in a private window.
2. Fill in the hero form (work email and company size) → **Book the call**.
   - Expected on the page: "Received. We will email you to set a time."
   - Expected in the sheet: a new row with Form = `hero`.
   - Expected in the inbox: "New ERPTEK lead: …", and Reply goes to the visitor.
3. Fill in the full form at the bottom. Optionally tick a few readiness-check items first and click **Talk this through**, so the Readiness score column fills.
4. If the page shows an error but the row **did** arrive, open the browser console. A CORS error on `script.googleusercontent.com` means the response couldn't be read. Re-check that the deployment is "Who has access: Anyone" and that you used the `/exec` URL, not `/dev`.
5. If the page shows "The security check did not pass", check that the Turnstile hostnames include the domain you're on and that the site key and secret belong to the same widget.

## 7. Content to confirm before launch

- `PUBLIC_CONTACT_EMAIL`: replace the placeholder address.
- **FAQ answers** (`src/components/Faq.astro`): they promise written data-handling agreements, no vendor lock-in and no forced ERP replacement. Confirm these match how ERPTEK works.
- **Hero demo** (`src/components/Hero.astro`): fictional bins, files and answers, labeled "Demo data" on the page. Keep or replace.
- **Proof**: no clients, testimonials, team bios or metrics were invented. Add real ones when they exist.
- **Logo**: the current mark is a typeset wordmark (`src/components/Wordmark.astro`); `public/favicon.svg` matches it.

## Local development

```bash
npm install
npm run dev       # http://localhost:4321
npm test
npm run detect    # Impeccable design anti-pattern check
```

To try the forms locally against the real script, set `PUBLIC_FORM_ENDPOINT` in `.env`. Use the always-passing Turnstile test keys: the site key in `.env`, and temporarily the test secret in the script's `TURNSTILE_SECRET`. Put the real secret back afterwards.
