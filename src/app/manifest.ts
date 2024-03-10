import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My awesome PWA app",
    short_name: "PWA App",
    icons: [
      {
        src: "static/images/logo_192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "static/images/logo_512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    theme_color: "#000000",
    background_color: "#000000",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
  };
}
