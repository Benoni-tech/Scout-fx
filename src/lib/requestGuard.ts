import { NextRequest, NextResponse } from "next/server";

// Front door for the public form APIs (event, community, Seed, signals).
//  - JSON only: a plain HTML form or a "simple" cross-site request from another
//    website can't send application/json without a CORS preflight, which we never allow.
//  - Same site only: browsers attach Origin to POSTs, so a request started by
//    another website is turned away even if it gets that far.
//  - Small bodies only, and malformed JSON is a clean 400 instead of a 500.

const MAX_BYTES = 20_000;

function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients; the other limits still apply
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }
  const own = [req.headers.get("x-forwarded-host"), req.headers.get("host"), req.nextUrl.host];
  return own.some((h) => h && h === host);
}

const reject = (error: string, status: number) => NextResponse.json({ error }, { status });

/** Parsed JSON body of a public form submission, or the response to send back instead. */
export async function readFormBody(
  req: NextRequest
): Promise<{ body: Record<string, unknown>; error?: never } | { body?: never; error: NextResponse }> {
  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) {
    return { error: reject("Unsupported request.", 415) };
  }
  if (!sameOrigin(req)) return { error: reject("Forbidden.", 403) };
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BYTES) {
    return { error: reject("Request too large.", 413) };
  }
  const text = await req.text();
  if (text.length > MAX_BYTES) return { error: reject("Request too large.", 413) };
  try {
    const body = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("not an object");
    return { body };
  } catch {
    return { error: reject("Invalid request.", 400) };
  }
}
