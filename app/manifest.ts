import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Billion Universe",
    short_name: "Billion",
    description: "Direct from anywhere. Execute anywhere else.",
    start_url: "/studio",
    display: "standalone",
    background_color: "#050508",
    theme_color: "#050508",
  };
}
