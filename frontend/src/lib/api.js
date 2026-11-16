// The browser only ever talks to this site. next.config.mjs forwards /api/* to the real API
// on the server side, which keeps session cookies first-party. Deliberately not configurable
// from the environment, so a stale NEXT_PUBLIC_* value cannot send the browser cross-site.
export const API_URL = "/api";
