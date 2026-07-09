import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Silas Blog",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#0f766e",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "256x256",
        type: "image/x-icon",
      },
    ],
  };
}
