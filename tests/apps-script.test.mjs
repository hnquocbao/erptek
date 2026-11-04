// Runs integrations/google-sheets/Code.gs under Node with fake Google services.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../integrations/google-sheets/Code.gs', import.meta.url), 'utf8');

function load({ props = {}, verify = { success: true, hostname: 'erptek.net' }, sheetThrows = false } = {}) {
  const rows = [];
  const mails = [];
  const fetches = [];
  const sheet = {
    getLastRow: () => rows.length,
    appendRow: (r) => {
      if (sheetThrows) throw new Error('quota');
      rows.push(r);
    },
    setFrozenRows: () => {},
  };
  const ctx = {
    console,
    JSON,
    Date,
    SpreadsheetApp: {
      getActiveSpreadsheet: () => ({
        getSheetByName: () => sheet,
        insertSheet: () => sheet,
        getUrl: () => 'https://docs.google.com/spreadsheets/d/TEST',
      }),
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] ?? null }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    UrlFetchApp: {
      fetch: (url, opts) => {
        fetches.push({ url, opts });
        return { getResponseCode: () => 200, getContentText: () => JSON.stringify(verify) };
      },
    },
    MailApp: { sendEmail: (m) => mails.push(m) },
    Session: { getEffectiveUser: () => ({ getEmail: () => 'owner@example.com' }) },
    ContentService: {
      MimeType: { JSON: 'json' },
      createTextOutput: (text) => ({ text, setMimeType() { return this; } }),
    },
  };
  vm.createContext(ctx);
  vm.runInContext(source, ctx);
  const post = (body) => JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify(body) } }).text);
  return { post, rows, mails, fetches, ctx };
}

const hero = { source: 'hero', email: 'lan@acme.vn', size: '21–100 people', page: '/' };
const close = { source: 'close', name: 'Lan Tran', email: 'lan@acme.vn', company: 'Acme', size: '1–20 people', notes: 'Quotes\ntake hours', readiness: '3/8 (Receiving dock)', page: '/' };

test('hero submission writes header + row and emails the owner', () => {
  const t = load();
  assert.deepEqual(t.post(hero), { ok: true });
  assert.equal(t.rows.length, 2);
  assert.equal(t.rows[0][0], 'Received (UTC)');
  assert.deepEqual([...t.rows[1].slice(1)], ['hero', '', 'lan@acme.vn', '', '21–100 people', '', '', '/']);
  assert.equal(t.mails.length, 1);
  assert.equal(t.mails[0].to, 'owner@example.com');
  assert.equal(t.mails[0].replyTo, 'lan@acme.vn');
});

test('NOTIFY_EMAIL overrides the recipient; full form fields reach the email', () => {
  const t = load({ props: { NOTIFY_EMAIL: 'sales@erptek.net' } });
  assert.equal(t.post(close).ok, true);
  const m = t.mails[0];
  assert.equal(m.to, 'sales@erptek.net');
  assert.match(m.subject, /Lan Tran \(Acme\)/);
  assert.match(m.htmlBody, /Quotes<br>take hours/);
  assert.match(m.htmlBody, /row 2/);
});

test('honeypot submissions are accepted silently and not stored', () => {
  const t = load();
  assert.deepEqual(t.post({ ...hero, website: 'http://spam' }), { ok: true });
  assert.equal(t.rows.length, 0);
  assert.equal(t.mails.length, 0);
});

test('validation errors', () => {
  const t = load();
  assert.equal(t.post({ ...hero, email: 'nope' }).error, 'email');
  assert.equal(t.post({ ...hero, size: '' }).error, 'size');
  assert.equal(t.post({ ...close, company: '' }).error, 'missing');
  assert.equal(t.rows.length, 0);
});

test('captcha: required when TURNSTILE_SECRET is set', () => {
  const t = load({ props: { TURNSTILE_SECRET: 's3cret' } });
  assert.equal(t.post(hero).error, 'captcha');
  assert.equal(t.fetches.length, 0);
  assert.equal(t.post({ ...hero, 'cf-turnstile-response': 'tok' }).ok, true);
  assert.equal(t.fetches[0].url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
  assert.deepEqual({ ...t.fetches[0].opts.payload }, { secret: 's3cret', response: 'tok' });
  assert.equal(t.rows.length, 2);
});

test('captcha: failed verification or wrong hostname is rejected', () => {
  const bad = load({ props: { TURNSTILE_SECRET: 's' }, verify: { success: false } });
  assert.equal(bad.post({ ...hero, 'cf-turnstile-response': 'tok' }).error, 'captcha');
  const host = load({ props: { TURNSTILE_SECRET: 's', ALLOWED_HOSTNAMES: 'erptek.net, www.erptek.net' }, verify: { success: true, hostname: 'evil.example' } });
  assert.equal(host.post({ ...hero, 'cf-turnstile-response': 'tok' }).error, 'captcha');
  assert.equal(bad.rows.length + host.rows.length, 0);
});

test('spreadsheet formulas are stored as text and email HTML is escaped', () => {
  const t = load();
  t.post({ ...close, name: '=HYPERLINK("http://x","click")', company: '<script>x</script>' });
  assert.equal(t.rows[1][2], '\'=HYPERLINK("http://x","click")');
  assert.ok(!t.mails[0].htmlBody.includes('<script>'));
  assert.match(t.mails[0].htmlBody, /&lt;script&gt;/);
});

test('oversized fields are truncated', () => {
  const t = load();
  t.post({ ...close, notes: 'x'.repeat(5000), company: 'y'.repeat(500) });
  assert.equal(t.rows[1][6].length, 2000);
  assert.equal(t.rows[1][4].length, 200);
});

test('broken JSON and storage failures return a generic server error', () => {
  const t = load();
  assert.equal(JSON.parse(t.ctx.doPost({ postData: { contents: '{nope' } }).text).error, 'server');
  assert.equal(JSON.parse(t.ctx.doPost({}).text).error, 'server');
  const s = load({ sheetThrows: true });
  assert.equal(s.post(hero).error, 'server');
  assert.equal(s.mails.length, 0);
});
