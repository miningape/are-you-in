const withSerwist = require("@serwist/next").default({
  swSrc: "src/service-worker/index.ts",
  swDest: "public/service-worker.js",

  // ! If this URL is changed also change `src/middleware.ts` such that the header `Service-Worker-Allowed: /` is sent on the response
  swUrl: "/service-worker.js",
  register: false,
  mode: "production",
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withSerwist(nextConfig);
