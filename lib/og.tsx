import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

const Paw = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <ellipse cx="6" cy="9.5" rx="2" ry="2.6" />
    <ellipse cx="10" cy="5.5" rx="2" ry="2.6" />
    <ellipse cx="14" cy="5.5" rx="2" ry="2.6" />
    <ellipse cx="18" cy="9.5" rx="2" ry="2.6" />
    <path d="M12 11c-2.6 0-5.5 3.6-5.5 6.2 0 1.8 1.4 2.8 3 2.8 1 0 1.7-.5 2.5-.5s1.5.5 2.5.5c1.6 0 3-1 3-2.8 0-2.6-2.9-6.2-5.5-6.2Z" />
  </svg>
);

// Shared share-image layout: brand panel with a headline and up to two fact lines.
export function ogImage({ eyebrow, title, facts }: { eyebrow: string; title: string; facts: string[] }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0a564e", color: "white", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 700, color: "#d5f2ec" }}>
          <div style={{ display: "flex", width: 60, height: 60, borderRadius: 16, background: "white", alignItems: "center", justifyContent: "center" }}>
            <Paw size={38} color="#0b6b60" />
          </div>
          {eyebrow}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 28, gap: 10 }}>
            {facts.map((f) => (
              <div key={f} style={{ fontSize: 34, color: "#d5f2ec" }}>{f}</div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#a9e3d8" }}>Fees change often. Always confirm with the airline before booking.</div>
      </div>
    ),
    ogSize,
  );
}
