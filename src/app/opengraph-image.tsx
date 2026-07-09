import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = "Silas Blog";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#fafaf9",
          color: "#18181b",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "28px", width: "100%" }}>
          <div style={{ color: "#0f766e", fontSize: 32, fontWeight: 700 }}>
            Personal Notes
          </div>
          <div style={{ fontSize: 86, fontWeight: 800, letterSpacing: 0, lineHeight: 1.05 }}>
            {site.name}
          </div>
          <div style={{ color: "#52525b", fontSize: 36, lineHeight: 1.35, maxWidth: 880 }}>
            {site.description}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
