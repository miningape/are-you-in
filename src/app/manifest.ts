import {
  APP_DEFAULT_TITLE,
  APP_DESCRIPTION,
  APP_NAME,
} from "@/util/constants/app";
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
    short_name: APP_NAME,
    // @ts-expect-error
    applicationServerKey: process.env.VAPID_PRIVATE_KEY,
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
