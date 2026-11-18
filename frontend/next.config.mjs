// Server-side only: where /api/* is forwarded to (see src/proxy.js). Never exposed to the browser.
const backendOrigin = process.env.BACKEND_ORIGIN;

if (!backendOrigin && process.env.VERCEL) {
  throw new Error("BACKEND_ORIGIN must be set on Vercel (the API that /api/* is proxied to).");
}

if (process.env.VERCEL_ENV === "production" && !process.env.ORIGIN_SECRET) {
  throw new Error("ORIGIN_SECRET must be set for production builds (src/proxy.js sends it to the API).");
}

const target = (backendOrigin || "http://127.0.0.1:5000").replace(/\/+$/, "");
new URL(target); // a malformed value fails the build instead of breaking at runtime

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
