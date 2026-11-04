/**
 * ERPTEK booking form -> Google Sheet + email notification.
 *
 * Paste into the Apps Script editor of the target Google Sheet
 * (Extensions -> Apps Script), then deploy as a Web app:
 *   Execute as: Me    Who has access: Anyone
 * The /exec URL is the site's PUBLIC_FORM_ENDPOINT.
 *
 * Script properties (Project Settings -> Script properties):
 *   NOTIFY_EMAIL        where new-lead emails go (default: the script owner)
 *   TURNSTILE_SECRET    Cloudflare Turnstile secret key; when set, every
 *                       submission must carry a valid captcha token
 *   ALLOWED_HOSTNAMES   optional, comma-separated, e.g. "erptek.net,www.erptek.net";
 *                       rejects tokens solved on other sites
 */

var SHEET_NAME = 'Leads';
var HEADERS = ['Received (UTC)', 'Form', 'Name', 'Email', 'Company', 'Company size', 'Notes', 'Readiness score', 'Page'];
var FIELDS = ['source', 'name', 'email', 'company', 'size', 'notes', 'readiness', 'page'];
var MAX_LEN = { notes: 2000, _default: 200 };
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function doPost(e) {
  try {
    var data = parseBody_(e);

    // Honeypot: real people never see or fill the "website" field.
    if (data.website) return json_({ ok: true });

    var problem = validate_(data);
    if (problem) return json_({ ok: false, error: problem });

    var props = PropertiesService.getScriptProperties();
    var secret = props.getProperty('TURNSTILE_SECRET');
    if (secret) {
      var allowed = (props.getProperty('ALLOWED_HOSTNAMES') || '')
        .split(',').map(function (h) { return h.trim(); }).filter(String);
      if (!verifyTurnstile_(secret, data['cf-turnstile-response'], allowed)) {
        return json_({ ok: false, error: 'captcha' });
      }
    }

    var row = appendLead_(data);
    notify_(props.getProperty('NOTIFY_EMAIL'), data, row);
    return json_({ ok: true });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    return json_({ ok: false, error: 'server' });
  }
}

function doGet() {
  return json_({ ok: true, service: 'erptek-leads' });
}

function parseBody_(e) {
  var raw = e && e.postData && e.postData.contents;
  if (!raw) throw new Error('empty body');
  var obj = JSON.parse(raw);
  if (!obj || typeof obj !== 'object') throw new Error('bad body');
  var out = {};
  Object.keys(obj).forEach(function (k) {
    var limit = MAX_LEN[k] || MAX_LEN._default;
    if (k === 'cf-turnstile-response') limit = 4096;
    out[k] = String(obj[k] == null ? '' : obj[k]).trim().slice(0, limit);
  });
  return out;
}

function validate_(d) {
  if (!d.email || !EMAIL_RE.test(d.email)) return 'email';
  if (!d.size) return 'size';
  if (d.source === 'close' && (!d.name || !d.company)) return 'missing';
  return '';
}

function verifyTurnstile_(secret, token, allowedHosts) {
  if (!token) return false;
  var res = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    payload: { secret: secret, response: token },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) return false;
  var body = JSON.parse(res.getContentText());
  if (!body.success) return false;
  if (allowedHosts && allowedHosts.length && allowedHosts.indexOf(body.hostname) === -1) return false;
  return true;
}

// Cells that start with = + - @ are formulas in Sheets; store them as text.
function cell_(v) {
  return /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function appendLead_(d) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getSheet_();
    var row = [new Date().toISOString()].concat(FIELDS.map(function (f) { return cell_(d[f] || ''); }));
    sheet.appendRow(row);
    return { number: sheet.getLastRow(), url: SpreadsheetApp.getActiveSpreadsheet().getUrl() };
  } finally {
    lock.releaseLock();
  }
}

function esc_(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function notify_(to, d, row) {
  var recipient = to || Session.getEffectiveUser().getEmail();
  var who = d.name || d.email;
  var rows = [
    ['Name', d.name], ['Email', d.email], ['Company', d.company], ['Company size', d.size],
    ['Most time goes to', d.notes], ['Readiness score', d.readiness], ['Form', d.source], ['Page', d.page],
  ].filter(function (r) { return r[1]; });
  var html = '<p>New readiness call request.</p><table cellpadding="6" style="border-collapse:collapse">' +
    rows.map(function (r) {
      return '<tr><td style="color:#555">' + esc_(r[0]) + '</td><td><b>' + esc_(r[1]).replace(/\n/g, '<br>') + '</b></td></tr>';
    }).join('') +
    '</table><p><a href="' + esc_(row.url) + '">Open the leads sheet</a> (row ' + row.number + ')</p>';
  MailApp.sendEmail({
    to: recipient,
    replyTo: d.email,
    subject: 'New ERPTEK lead: ' + who + (d.company ? ' (' + d.company + ')' : ''),
    htmlBody: html,
    body: rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n'),
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to grant permissions and check the email arrives. */
function testSetup() {
  var row = appendLead_({ source: 'test', name: 'Test lead', email: Session.getEffectiveUser().getEmail(), size: '1–20 people', page: 'editor test' });
  notify_(PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL'), { source: 'test', name: 'Test lead', email: Session.getEffectiveUser().getEmail(), size: '1–20 people' }, row);
}
