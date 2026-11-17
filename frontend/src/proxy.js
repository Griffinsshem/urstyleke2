import { NextResponse } from "next/server";

// Milestone 2.4c, phase A experiment: does a header set here reach the API
// when the rewrite points at an external origin? Remove after the experiment.
export function proxy(request) {
  const secret = (process.env.ORIGIN_SECRET || "").trim();
  if (!secret) {
    return NextResponse.json({ error: "probe not configured" }, { status: 503 });
  }
  const backend = process.env.BACKEND_ORIGIN || "http://127.0.0.1:5000";
  const headers = new Headers(request.headers);
  headers.set("x-origin-secret", secret);
  return NextResponse.rewrite(new URL("/api/products", backend), {
    request: { headers },
  });
}

export const config = { matcher: "/probe-origin" };
