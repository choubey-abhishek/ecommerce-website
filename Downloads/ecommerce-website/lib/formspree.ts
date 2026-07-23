/**
 * Formspree integration — the single, configurable backend for the
 * Contact form and the Contact chatbot. The endpoint is read from an
 * environment variable so it is never hardcoded and can be swapped
 * without touching component code:
 *
 *   NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxx
 *
 * The `NEXT_PUBLIC_` prefix is required because both submitters run in
 * the browser. A Formspree form URL is not a secret (it's a public
 * submission endpoint with its own spam protection), so exposing it
 * client-side is expected and safe — no private credentials are involved.
 */
export const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "";

/** True only when a real endpoint has been configured. */
export const isFormspreeConfigured = Boolean(FORMSPREE_ENDPOINT);

export interface FormspreeResult {
  ok: boolean;
  error?: string;
}

/** Collapse whitespace and cap length — light sanitisation before send. */
function clean(value: unknown, max = 2000): string {
  if (value == null) return "";
  return String(value).replace(/\s+/g, " ").trim().slice(0, max);
}

/**
 * Submits a plain object to Formspree as JSON. Trims/caps every string
 * value, drops empty ones, and returns a discriminated result rather than
 * throwing so callers can render inline error UI and offer a retry.
 */
export async function submitToFormspree(
  data: Record<string, unknown>
): Promise<FormspreeResult> {
  if (!isFormspreeConfigured) {
    return {
      ok: false,
      error:
        "The contact endpoint isn't configured yet. Set NEXT_PUBLIC_FORMSPREE_ENDPOINT in .env.local.",
    };
  }

  const payload: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    const cleaned = clean(value, key === "message" || key === "project" ? 5000 : 500);
    if (cleaned) payload[key] = cleaned;
  }

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) return { ok: true };

    const body = (await res.json().catch(() => null)) as
      | { errors?: { message?: string }[] }
      | null;
    return {
      ok: false,
      error: body?.errors?.[0]?.message ?? "Something went wrong. Please try again.",
    };
  } catch {
    return { ok: false, error: "Network error — please check your connection and retry." };
  }
}
