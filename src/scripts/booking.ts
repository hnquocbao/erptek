// Shared submit logic for every [data-booking] form on the page.
//
// With PUBLIC_FORM_ENDPOINT set (the Google Apps Script web app URL), forms POST
// their fields as JSON. The body is sent as text/plain so the browser makes a
// "simple" request: Apps Script cannot answer CORS preflights.
// With PUBLIC_TURNSTILE_SITE_KEY set, each form gets a Cloudflare Turnstile check
// whose token travels with the submission and is verified by the Apps Script.
// Without an endpoint, forms fall back to opening an email draft.

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  getResponse: (id: string) => string | undefined;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
    __erptekTurnstileReady?: () => void;
  }
}

const endpoint = (import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined) || '';
const siteKey = (import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined) || '';
const contact = (import.meta.env.PUBLIC_CONTACT_EMAIL as string | undefined) || 'hello@erptek.net';
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__erptekTurnstileReady';

const widgets = new WeakMap<HTMLFormElement, string>();

const text = {
  en: {
    invalid: 'Check the highlighted field, then send again.',
    mailto: `Opening your email app. If nothing happens, write to ${contact}.`,
    subject: 'Readiness call request',
    loading: 'The security check is still loading. Wait a moment, then send again.',
    sending: 'Sending…',
    ok: 'Received. We will email you to set a time.',
    email: 'That email address does not look right. Check it and send again.',
    size: 'Choose your company size, then send again.',
    missing: 'Fill in your name and company, then send again.',
    captcha: 'The security check did not pass. Wait for it to finish, then send again.',
    server: `Something went wrong on our side. Try again, or write to ${contact}.`,
  },
  vi: {
    invalid: 'Kiểm tra ô được đánh dấu rồi gửi lại.',
    mailto: `Đang mở ứng dụng email. Nếu không có gì xảy ra, hãy viết cho ${contact}.`,
    subject: 'Yêu cầu tư vấn mức sẵn sàng',
    loading: 'Bước kiểm tra bảo mật đang tải. Vui lòng đợi một chút rồi gửi lại.',
    sending: 'Đang gửi…',
    ok: 'Đã nhận. Chúng tôi sẽ email cho bạn để hẹn lịch.',
    email: 'Địa chỉ email có vẻ chưa đúng. Kiểm tra lại rồi gửi.',
    size: 'Chọn quy mô công ty rồi gửi lại.',
    missing: 'Điền họ tên và tên công ty rồi gửi lại.',
    captcha: 'Bước kiểm tra bảo mật chưa đạt. Đợi kiểm tra hoàn tất rồi gửi lại.',
    server: `Có lỗi ở phía chúng tôi. Hãy thử lại, hoặc viết cho ${contact}.`,
  },
};
type Lang = keyof typeof text;
const lang: Lang = document.documentElement.lang === 'vi' ? 'vi' : 'en';
const msg = text[lang];
const errorCodes = ['email', 'size', 'missing', 'captcha', 'server'] as const;

function setStatus(form: HTMLFormElement, state: 'ok' | 'error' | 'busy' | '', text: string) {
  const status = form.querySelector<HTMLElement>('.form-status');
  if (!status) return;
  status.dataset.state = state;
  status.textContent = text;
}

function mailtoFallback(data: Record<string, string>) {
  const lines = Object.entries(data)
    .filter(([k, v]) => v && k !== 'website' && k !== 'cf-turnstile-response')
    .map(([k, v]) => `${k}: ${v}`);
  window.location.href = `mailto:${contact}?subject=${encodeURIComponent(msg.subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

function loadTurnstile(forms: HTMLFormElement[]) {
  if (!siteKey || !endpoint || !forms.length) return;
  window.__erptekTurnstileReady = () => {
    forms.forEach((form) => {
      const slot = form.querySelector<HTMLElement>('[data-captcha]');
      if (!slot || !window.turnstile) return;
      const id = window.turnstile.render(slot, {
        sitekey: siteKey,
        action: form.dataset.booking || 'booking',
        theme: 'light',
        size: 'flexible',
        // Stays hidden unless Cloudflare needs the visitor to click.
        appearance: 'interaction-only',
        'response-field': false,
        language: lang,
      });
      widgets.set(form, id);
    });
  };
  const s = document.createElement('script');
  s.src = TURNSTILE_SRC;
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
}

function captchaToken(form: HTMLFormElement): string | null {
  if (!siteKey) return '';
  const id = widgets.get(form);
  if (!id || !window.turnstile) return null;
  return window.turnstile.getResponse(id) || null;
}

function resetCaptcha(form: HTMLFormElement) {
  const id = widgets.get(form);
  if (id && window.turnstile) window.turnstile.reset(id);
}

export function initBookingForms() {
  const forms = Array.from(document.querySelectorAll<HTMLFormElement>('form[data-booking]'));
  loadTurnstile(forms);

  forms.forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        setStatus(form, 'error', msg.invalid);
        return;
      }
      const data: Record<string, string> = Object.fromEntries(
        Array.from(new FormData(form).entries()).map(([k, v]) => [k, String(v).trim()]),
      );
      data.source = form.dataset.booking || 'site';
      data.page = window.location.pathname;

      if (!endpoint) {
        setStatus(form, 'ok', msg.mailto);
        mailtoFallback(data);
        return;
      }

      const token = captchaToken(form);
      if (token === null) {
        setStatus(form, 'error', msg.loading);
        return;
      }
      if (token) data['cf-turnstile-response'] = token;

      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      const label = button?.textContent;
      if (button) {
        button.disabled = true;
        button.textContent = msg.sending;
      }
      setStatus(form, 'busy', '');
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(data),
          redirect: 'follow',
        });
        const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
        if (!res.ok || !body.ok) throw new Error(body.error || 'server');
        form.reset();
        setStatus(form, 'ok', msg.ok);
      } catch (err) {
        const code = err instanceof Error ? err.message : 'server';
        const known = (errorCodes as readonly string[]).includes(code) ? (code as (typeof errorCodes)[number]) : 'server';
        setStatus(form, 'error', msg[known]);
      } finally {
        resetCaptcha(form);
        if (button) {
          button.disabled = false;
          button.textContent = label ?? 'Send';
        }
      }
    });
  });
}
