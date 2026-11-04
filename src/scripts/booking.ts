// Shared submit logic for every [data-booking] form on the page.
// Posts JSON to PUBLIC_FORM_ENDPOINT when set; otherwise opens an email draft.
const endpoint = import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined;
const contact = (import.meta.env.PUBLIC_CONTACT_EMAIL as string | undefined) || 'hello@erptek.net';

function setStatus(form: HTMLFormElement, state: 'ok' | 'error' | 'busy' | '', text: string) {
  const status = form.querySelector<HTMLElement>('.form-status');
  if (!status) return;
  status.dataset.state = state;
  status.textContent = text;
}

function mailtoFallback(data: Record<string, string>) {
  const lines = Object.entries(data)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);
  const href = `mailto:${contact}?subject=${encodeURIComponent('Readiness call request')}&body=${encodeURIComponent(lines.join('\n'))}`;
  window.location.href = href;
}

export function initBookingForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-booking]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        setStatus(form, 'error', 'Check the highlighted field, then send again.');
        return;
      }
      const data = Object.fromEntries(
        Array.from(new FormData(form).entries()).map(([k, v]) => [k, String(v).trim()]),
      );
      data.source = form.dataset.booking || 'site';

      if (!endpoint) {
        setStatus(form, 'ok', `Opening your email app. If nothing happens, write to ${contact}.`);
        mailtoFallback(data);
        return;
      }

      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      const label = button?.textContent;
      if (button) {
        button.disabled = true;
        button.textContent = 'Sending…';
      }
      setStatus(form, 'busy', '');
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        setStatus(form, 'ok', 'Received. We will email you to set a time.');
      } catch {
        setStatus(form, 'error', `That did not go through. Try again, or write to ${contact}.`);
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = label ?? 'Send';
        }
      }
    });
  });
}
