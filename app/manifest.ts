import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pomodoro Focus Timer",
    short_name: "Pomodoro",
    description: "Stay productive with the Pomodoro Technique Timer",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#9333ea",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["productivity", "utilities"],
    screenshots: [
      {
        src: "/screenshot-mobile.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
  }
}
