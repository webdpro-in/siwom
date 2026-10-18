import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { contactSchema, MIN_FILL_MS, type ContactResponse } from "@/lib/validation/contact";


const MAX_BODY_BYTES = 20_000;

function json(body: ContactResponse, status: number, headers: HeadersInit = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    signal: AbortSignal.timeout(10_000),
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
  return Boolean(data?.success);
}

export async function POST(request: Request) {
  const ip = clientIp(request.headers);

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return json({ ok: false, error: "That message is too long to send." }, 413);

  const limited = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!limited.ok) {
    return json(
      { ok: false, error: "Too many messages from this connection. Please try again later or email us." },
      429,
      { "Retry-After": String(limited.retryAfter) },
    );
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return json({ ok: false, error: "That message is too long to send." }, 413);
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "The form data could not be read. Please try again." }, 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      { ok: false, error: "Some fields need attention.", fieldErrors: z.flattenError(parsed.error).fieldErrors },
      400,
    );
  }
  const data = parsed.data;

  // Honeypot filled or submitted faster than a person could: treat as spam.
  if (data.website) return json({ ok: false, error: "This message could not be sent." }, 422);
  if (Date.now() - data.startedAt < MIN_FILL_MS) {
    return json({ ok: false, error: "That was quicker than expected. Please wait a moment and send again." }, 422);
  }

  try {
    if (!(await verifyTurnstile(data.turnstileToken, ip))) {
      return json({ ok: false, error: "The verification check did not pass. Please try again." }, 400);
    }
    // Validation only. Web3Forms recommends submission from the visitor’s browser.
    // The client must still require the provider’s explicit success response.
    return json({ ok: true, validated: true }, 200);
  } catch {
    return json({ ok: false, error: "The form service could not be reached. Please try again shortly." }, 502);
  }
}
