import { ImageResponse } from "next/og";

import { PROFILE } from "@/content/profile";

export const alt = `${PROFILE.name} — ${PROFILE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* OG images render outside the CSS pipeline, so the tokens are spelled out here (same values as globals.css). */
const BG = "hsl(0 0% 4%)";
const SURFACE = "hsl(0 0% 7%)";
const BORDER = "hsl(0 0% 16%)";
const FG = "hsl(0 0% 95%)";
const MUTED = "hsl(0 0% 64%)";
const GREEN = "hsl(142 72% 50%)";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: `radial-gradient(circle at 80% 0%, hsl(142 72% 50% / 0.18), transparent 55%), ${BG}`,
          color: FG,
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 30, fontWeight: 700, fontFamily: "sans-serif" }}>{PROFILE.name}</div>
          <div style={{ fontSize: 20, color: GREEN, border: `1px solid ${GREEN}`, borderRadius: 8, padding: "4px 12px" }}>
            {PROFILE.shortRole}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.02, fontFamily: "sans-serif", display: "flex" }}>
            {PROFILE.headline}
            <span style={{ width: 30, height: 64, background: GREEN, marginLeft: 14, marginTop: 10 }} />
          </div>
          <div style={{ fontSize: 26, color: MUTED }}>{`${PROFILE.role} · ${PROFILE.location}`}</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {PROFILE.heroPills.map((pill) => (
            <div key={pill} style={{ fontSize: 22, padding: "8px 16px", borderRadius: 10, background: SURFACE, border: `1px solid ${BORDER}` }}>
              {pill}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
