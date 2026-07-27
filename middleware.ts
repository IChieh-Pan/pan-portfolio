// Vercel Edge Middleware — password gate for the unreleased AI Personalization
// case study. Shows a custom password-only login page (no username), and on the
// correct password sets a cookie so the static page is then served. Runs on
// Vercel's edge BEFORE the HTML is delivered, so content never leaks unauthorized.
//
// Set in Vercel → Project → Settings → Environment Variables:
//   CASE_STUDY_PASSWORD  (required) — the shared password you give viewers
//
// Fails CLOSED: with no password configured, the page is locked for everyone.

export const config = {
  matcher: [
    "/work/ai-context-layer",
    "/work/ai-context-layer/",
    "/work/ai-context-layer/index.html",
  ],
};

const COOKIE = "cs_auth";

async function token(secret: string): Promise<string> {
  const data = new TextEncoder().encode("cs-gate:" + secret);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function page(opts: { error?: boolean; locked?: boolean }): Response {
  const { error = false, locked = false } = opts;
  const body = locked
    ? `<h1>Not available</h1><p class="sub">This case study isn't available to view right now.</p><p class="back"><a href="/">&larr; Back to portfolio</a></p>`
    : `<h1>Password&#8209;protected</h1>
       <p class="sub">Enter the password to view it.</p>
       <form method="POST">
         <input type="password" name="password" placeholder="Password" aria-label="Password" autocomplete="current-password" autofocus required />
         <button type="submit">View case study</button>
         ${error ? `<p class="err">Incorrect password &mdash; try again.</p>` : ``}
       </form>
       <p class="back"><a href="/">&larr; Back to portfolio</a></p>`;

  return new Response(
    `<!doctype html><html lang="en"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Password-protected &middot; I-Chieh Pan</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
    background:#f2e8e3; color:#1b1b18; padding:24px;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  main { width:100%; max-width:420px; text-align:center; }
  h1 { font-size:1.6rem; font-weight:700; letter-spacing:-0.02em; margin:0 0 .5rem; }
  .sub { color:#6c685f; font-size:.95rem; line-height:1.5; margin:0 0 1.75rem; }
  form { display:flex; flex-direction:column; gap:.75rem; }
  input { width:100%; padding:.8rem 1rem; font-size:1rem; border:1px solid #d9d5cc; border-radius:.75rem;
    background:#fff; color:#1b1b18; outline:none; }
  input:focus { border-color:#0041d9; box-shadow:0 0 0 3px rgba(0,65,217,.15); }
  button { padding:.8rem 1rem; font-size:1rem; font-weight:600; border:0; border-radius:.75rem;
    background:#0041d9; color:#fff; cursor:pointer; }
  button:hover { background:#0038bd; }
  .err { color:#b3261e; font-size:.85rem; margin:.25rem 0 0; }
  .back { margin-top:1.75rem; font-size:.85rem; }
  .back a { color:#6c685f; text-decoration:none; }
  .back a:hover { color:#1b1b18; }
</style>
</head><body><main>${body}</main></body></html>`,
    {
      status: locked ? 403 : error ? 401 : 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    },
  );
}

const GATE_ENABLED = false;

export default async function middleware(request: Request): Promise<Response | undefined> {
  if (!GATE_ENABLED) return;

  const PASS = process.env.CASE_STUDY_PASSWORD;
  if (!PASS) return page({ locked: true });

  const expected = await token(PASS);
  const url = new URL(request.url);

  // Login submission
  if (request.method === "POST") {
    const form = await request.formData();
    const entered = String(form.get("password") ?? "");
    if (entered && (await token(entered)) === expected) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: url.pathname,
          "Set-Cookie": `${COOKIE}=${expected}; Path=/work/ai-context-layer; HttpOnly; Secure; SameSite=Lax; Max-Age=43200`,
        },
      });
    }
    return page({ error: true });
  }

  // Already authenticated?
  const cookies = request.headers.get("cookie") ?? "";
  const ok = cookies.split(/;\s*/).some((c) => c === `${COOKIE}=${expected}`);
  if (ok) return; // continue to the static page

  return page({ error: false });
}
