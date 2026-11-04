# Booking form → Google Sheet + email

Every submission from the site's two booking forms is checked, appended as a row to a Google Sheet, and emailed to you. A Google Apps Script web app attached to the sheet does the work; there's no server to run.

```
browser ── POST (JSON as text/plain) ──▶ Apps Script web app ──▶ Cloudflare siteverify (captcha)
                                              ├──▶ "Leads" tab in your Google Sheet
                                              └──▶ email to NOTIFY_EMAIL (reply-to = the visitor)
```

Bot protection, in three layers:
1. **Cloudflare Turnstile.** A free captcha that most visitors never see (it only asks for a click when Cloudflare is unsure). The script verifies each token with Cloudflare before saving anything.
2. **Honeypot field.** A hidden `website` input. Submissions that fill it are accepted silently and dropped.
3. **Server-side checks.** Email format, required fields, length limits, and formula injection protection: values that start with `=`, `+`, `-` or `@` are stored as text.

## 1. Create the sheet and script

1. Create a Google Sheet, for example "ERPTEK leads". The script creates a `Leads` tab with headers on the first submission.
2. In the sheet: **Extensions → Apps Script**. Replace the editor contents with [`Code.gs`](Code.gs) and save.
3. **Project Settings (gear) → Script properties**, add:
   - `NOTIFY_EMAIL`: where lead emails go. Without it, emails go to the Google account that owns the script.
   - `TURNSTILE_SECRET`: the secret key from step 2 below.
   - `ALLOWED_HOSTNAMES`: `erptek.net,www.erptek.net`. This rejects captcha tokens solved on other sites.
4. Back in the editor, select `testSetup` and click **Run**. Approve the permissions (Sheets, sending email, external requests). A test row and a test email should appear. Delete the test row afterwards.
5. **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**

   Copy the URL ending in `/exec`.

Editing `Code.gs` later: **Deploy → Manage deployments → edit (pencil) → Version: New version**. The `/exec` URL stays the same. "New deployment" would give you a new URL.

## 2. Create the Turnstile keys

Cloudflare dashboard → **Turnstile → Add widget**. Hostnames: `erptek.net` and `www.erptek.net` (add `localhost` for local testing). Mode: **Managed**. You get:
- **Site key** (public): goes to the site as `PUBLIC_TURNSTILE_SITE_KEY`
- **Secret key**: goes only into the Apps Script property `TURNSTILE_SECRET`

For local testing, Cloudflare's test keys always pass: site key `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`.

## 3. Configure the site and rebuild

```
PUBLIC_FORM_ENDPOINT=https://script.google.com/macros/s/XXXX/exec
PUBLIC_TURNSTILE_SITE_KEY=0x4AAAA...
PUBLIC_CONTACT_EMAIL=you@erptek.net
```

These are build-time values, so rebuild and redeploy after changing them.

## 4. Check it live

Submit the hero form on erptek.net. You should see "Received. We will email you to set a time.", a new row in the sheet, and an email. If the page reports an error but the row did arrive, open the browser console and check whether the response from `script.googleusercontent.com` was blocked by CORS.

## Limits

- Gmail allows about 100 script emails a day on a free account and 1,500 on Google Workspace. That's far above normal lead volume.
- Errors are logged in Apps Script → **Executions**.

## Tests

`npm test` runs `Code.gs` under Node with fake Google services (`tests/apps-script.test.mjs`) and drives both forms in Chromium against a local stand-in for the web app (`tests/e2e-forms.test.mjs`).
