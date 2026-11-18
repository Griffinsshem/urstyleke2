import { NextResponse } from "next/server";

// Every /api/* request is forwarded to the API from here instead of a rewrite
// in next.config.mjs, so that we can add X-Origin-Secret. The API trusts one
// more X-Forwarded-For hop only for requests that carry it (see
// backend/app/proxy.py). The secret is server-side only and never reaches the browser.
export function proxy(request) {
  const origin = (process.env.BACKEND_ORIGIN || "http://127.0.0.1:5000").replace(/\/+$/, "");
  const secret = (process.env.ORIGIN_SECRET || "").trim();

  const headers = new Headers(request.headers);
  headers.delete("x-origin-secret"); // never trust one sent by a browser

  if (secret) {
    headers.set("x-origin-secret", secret);
  } else if (process.env.VERCEL) {
    // Fail closed: without the secret the API would count every visitor as the
    // same address, which would share one rate-limit bucket between everyone.
    return NextResponse.json(
      { error: "Service temporarily unavailable.", code: "proxy_misconfigured" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const url = new URL(request.nextUrl.pathname + request.nextUrl.search, origin);
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = { matcher: "/api/:path*" };
