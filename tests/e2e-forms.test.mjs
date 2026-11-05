// Browser test of the booking forms against a local stand-in for the Apps Script
// web app (POST /exec -> 302 to another origin, like script.googleusercontent.com)
// and a fake Cloudflare Turnstile. Builds the site into dist-test/ first.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const OUT = path.join(ROOT, 'dist-test');
const SITE = 4410, API = 4411, ECHO = 4412;

const seen = { posts: [], options: 0, nextReply: { ok: true } };
let servers = [], browser;

function listen(port, handler) {
  const s = createServer(handler);
  servers.push(s);
  return new Promise((r) => s.listen(port, '127.0.0.1', r));
}

before(async () => {
  execSync(`npx astro build --outDir ${OUT}`, {
    cwd: ROOT,
    stdio: 'ignore',
    env: { ...process.env, PUBLIC_FORM_ENDPOINT: `http://127.0.0.1:${API}/exec`, PUBLIC_TURNSTILE_SITE_KEY: 'test-site-key' },
  });
  await listen(SITE, (req, res) => {
    const p = path.join(OUT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
    if (!p.startsWith(OUT) || !existsSync(p)) return res.writeHead(404).end();
    const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' }[path.extname(p)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type }).end(readFileSync(p));
  });
  // Apps Script stand-in: like script.google.com/macros/.../exec, it answers the POST with a
  // 302 (carrying Access-Control-Allow-Origin: *) to another origin that returns the JSON.
  // It never answers a preflight, so a non-simple request would fail here as it does live.
  await listen(API, (req, res) => {
    if (req.method === 'OPTIONS') { seen.options++; return res.writeHead(405).end(); }
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      seen.posts.push({ type: req.headers['content-type'], body: JSON.parse(body) });
      res.writeHead(302, { Location: `http://127.0.0.1:${ECHO}/echo`, 'Access-Control-Allow-Origin': '*' }).end();
    });
  });
  await listen(ECHO, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }).end(JSON.stringify(seen.nextReply));
  });
  browser = await chromium.launch();
});

after(async () => {
  await browser?.close();
  servers.forEach((s) => s.close());
});

async function openPage() {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.route('https://challenges.cloudflare.com/**', (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      body: `window.__resets = [];
        window.turnstile = {
          render(el, o) { el.dataset.sitekey = o.sitekey; el.dataset.action = o.action; return 'w-' + o.action; },
          getResponse() { return 'fake-token'; },
          reset(id) { window.__resets.push(id); },
        };
        window.__erptekTurnstileReady();`,
    }),
  );
  await page.goto(`http://127.0.0.1:${SITE}/`);
  await page.waitForFunction(() => document.querySelector('form[data-booking="hero"] [data-captcha]')?.dataset.sitekey);
  return page;
}

test('Turnstile renders once per form with the site key and form action', async () => {
  const page = await openPage();
  const slots = await page.$$eval('[data-captcha]', (els) => els.map((e) => [e.dataset.sitekey, e.dataset.action]));
  assert.deepEqual(slots, [['test-site-key', 'hero'], ['test-site-key', 'close']]);
  await page.close();
});

test('hero form posts a simple text/plain request with the captcha token', async () => {
  seen.posts.length = 0; seen.options = 0; seen.nextReply = { ok: true };
  const page = await openPage();
  const form = page.locator('form[data-booking="hero"]');
  await form.locator('input[name="email"]').fill('lan@acme.vn');
  await form.locator('select[name="size"]').selectOption('21–100 people');
  await form.locator('button[type="submit"]').click();
  await assert.doesNotReject(form.locator('.form-status[data-state="ok"]').waitFor({ timeout: 5000 }));
  assert.match(await form.locator('.form-status').textContent(), /Received/);
  assert.equal(seen.options, 0, 'no CORS preflight');
  assert.equal(seen.posts.length, 1);
  assert.match(seen.posts[0].type, /^text\/plain/);
  const b = seen.posts[0].body;
  assert.equal(b.email, 'lan@acme.vn');
  assert.equal(b.size, '21–100 people');
  assert.equal(b.source, 'hero');
  assert.equal(b.page, '/');
  assert.equal(b.website, '');
  assert.equal(b['cf-turnstile-response'], 'fake-token');
  assert.equal(await form.locator('input[name="email"]').inputValue(), '', 'form resets');
  assert.deepEqual(await page.evaluate(() => window.__resets), ['w-hero']);
  await page.close();
});

test('closing form sends every field, including the readiness score', async () => {
  seen.posts.length = 0; seen.nextReply = { ok: true };
  const page = await openPage();
  await page.locator('#readiness input[type="checkbox"]').nth(0).check({ force: true });
  await page.locator('#readiness input[type="checkbox"]').nth(1).check({ force: true });
  await page.click('[data-ready-cta]');
  const form = page.locator('form[data-booking="close"]');
  await form.locator('#book-name').fill('Lan Tran');
  await form.locator('#book-email').fill('lan@acme.vn');
  await form.locator('#book-company').fill('Acme');
  await form.locator('#book-size').selectOption('1–20 people');
  await form.locator('#book-notes').fill('Quotes take hours');
  await form.locator('button[type="submit"]').click();
  await form.locator('.form-status[data-state="ok"]').waitFor({ timeout: 5000 });
  const b = seen.posts[0].body;
  assert.deepEqual(
    { name: b.name, company: b.company, notes: b.notes, readiness: b.readiness, source: b.source },
    { name: 'Lan Tran', company: 'Acme', notes: 'Quotes take hours', readiness: '2/8 (Receiving dock)', source: 'close' },
  );
  await page.close();
});

test('a rejected captcha shows a recoverable message and keeps the input', async () => {
  seen.posts.length = 0; seen.nextReply = { ok: false, error: 'captcha' };
  const page = await openPage();
  const form = page.locator('form[data-booking="hero"]');
  await form.locator('input[name="email"]').fill('lan@acme.vn');
  await form.locator('select[name="size"]').selectOption('1–20 people');
  await form.locator('button[type="submit"]').click();
  await form.locator('.form-status[data-state="error"]').waitFor({ timeout: 5000 });
  assert.match(await form.locator('.form-status').textContent(), /security check/);
  assert.equal(await form.locator('input[name="email"]').inputValue(), 'lan@acme.vn');
  assert.equal(await form.locator('button[type="submit"]').isEnabled(), true);
  await page.close();
});

test('invalid input never reaches the endpoint', async () => {
  seen.posts.length = 0;
  const page = await openPage();
  const form = page.locator('form[data-booking="hero"]');
  await form.locator('input[name="email"]').fill('not-an-email');
  await form.locator('button[type="submit"]').click();
  await form.locator('.form-status[data-state="error"]').waitFor({ timeout: 3000 });
  assert.equal(seen.posts.length, 0);
  await page.close();
});

test('Vietnamese page: translated UI, English values in the submission', async () => {
  seen.posts.length = 0; seen.nextReply = { ok: true };
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.route('https://challenges.cloudflare.com/**', (route) =>
    route.fulfill({ contentType: 'text/javascript', body: `window.turnstile = { render(el, o) { el.dataset.language = o.language; return 'w'; }, getResponse() { return 'fake-token'; }, reset() {} }; window.__erptekTurnstileReady();` }),
  );
  await page.goto(`http://127.0.0.1:${SITE}/vi/`);
  assert.equal(await page.getAttribute('html', 'lang'), 'vi');
  assert.match(await page.textContent('h1'), /dán nhãn/);
  assert.equal(await page.getAttribute('.langs a[aria-current="page"]', 'hreflang'), 'vi');
  assert.equal(await page.getAttribute('.langs a[hreflang="en"]', 'href'), '/');
  await page.waitForFunction(() => document.querySelector('[data-captcha]')?.dataset.language === 'vi');
  const form = page.locator('form[data-booking="hero"]');
  await form.locator('input[name="email"]').fill('lan@acme.vn');
  await form.locator('select[name="size"]').selectOption({ label: '21–100 người' });
  await form.locator('button[type="submit"]').click();
  await form.locator('.form-status[data-state="ok"]').waitFor({ timeout: 5000 });
  assert.match(await form.locator('.form-status').textContent(), /Đã nhận/);
  assert.equal(seen.posts[0].body.size, '21–100 people');
  assert.equal(seen.posts[0].body.page, '/vi/');
  await page.close();
});

test('Vietnamese readiness check and error messages', async () => {
  seen.posts.length = 0; seen.nextReply = { ok: false, error: 'email' };
  const page = await openPage.call(null).then(async (p) => { await p.goto(`http://127.0.0.1:${SITE}/vi/`); return p; });
  await page.locator('#readiness input[type="checkbox"]').nth(0).check({ force: true });
  assert.equal(await page.textContent('[data-zone]'), 'Bến nhập kho');
  for (let i = 1; i < 7; i++) await page.locator('#readiness input[type="checkbox"]').nth(i).check({ force: true });
  assert.equal(await page.textContent('[data-zone]'), 'Sẵn sàng lấy hàng');
  const form = page.locator('form[data-booking="hero"]');
  await page.waitForFunction(() => document.querySelector('form[data-booking="hero"] [data-captcha]')?.dataset.sitekey);
  await form.locator('input[name="email"]').fill('lan@acme.vn');
  await form.locator('select[name="size"]').selectOption({ index: 1 });
  await form.locator('button[type="submit"]').click();
  await form.locator('.form-status[data-state="error"]').waitFor({ timeout: 5000 });
  assert.match(await form.locator('.form-status').textContent(), /email có vẻ chưa đúng/);
  await page.close();
});
