// Vercel Edge Middleware — HTTP Basic Auth gate for the unreleased
// AI Personalization case study. Runs on Vercel's edge BEFORE the static
// HTML is served, so the page content is never delivered without the password.
//
// Set these in Vercel → Project → Settings → Environment Variables:
//   CASE_STUDY_PASSWORD  (required)  — the shared password you hand to viewers
//   CASE_STUDY_USER      (optional)  — defaults to "portfolio"
//
// Fails CLOSED: if no password env var is configured, the page is locked for
// everyone (safer for NDA content).

export const config = {
  matcher: ["/work/ai-context-layer", "/work/ai-context-layer/"],
};

export default function middleware(request: Request): Response | undefined {
  const USER = process.env.CASE_STUDY_USER ?? "portfolio";
  const PASS = process.env.CASE_STUDY_PASSWORD;

  const header = request.headers.get("authorization");
  if (PASS && header) {
    const [scheme, encoded] = header.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const sep = decoded.indexOf(":");
      const user = decoded.slice(0, sep);
      const pass = decoded.slice(sep + 1);
      if (user === USER && pass === PASS) {
        return; // authorized → continue to the page
      }
    }
  }

  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Protected case study", charset="UTF-8"',
      "content-type": "text/plain",
    },
  });
}
