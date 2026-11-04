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

## Deploy

The output is static files in `dist/`, so any static host works: Cloudflare Pages, Netlify, Vercel or GitHub Pages. Build command `npm run build`, output directory `dist`. Point the `erptek.net` DNS at the host.

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
