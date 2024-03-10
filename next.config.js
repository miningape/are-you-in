const withSerwist = require("@serwist/next").default({
  swSrc: "src/service-worker/index.ts",
  swDest: "public/static/service-worker.js",

  // ! If this URL is changed also change `src/middleware.ts` such that the header `Service-Worker-Allowed: /` is sent on the response
  swUrl: "/static/service-worker.js",
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withSerwist(nextConfig);
