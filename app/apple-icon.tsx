import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b6b60" }}>
        <svg width={120} height={120} viewBox="0 0 24 24" fill="white">
          <ellipse cx="6" cy="9.5" rx="2" ry="2.6" />
          <ellipse cx="10" cy="5.5" rx="2" ry="2.6" />
          <ellipse cx="14" cy="5.5" rx="2" ry="2.6" />
          <ellipse cx="18" cy="9.5" rx="2" ry="2.6" />
          <path d="M12 11c-2.6 0-5.5 3.6-5.5 6.2 0 1.8 1.4 2.8 3 2.8 1 0 1.7-.5 2.5-.5s1.5.5 2.5.5c1.6 0 3-1 3-2.8 0-2.6-2.9-6.2-5.5-6.2Z" />
        </svg>
      </div>
    ),
    size,
  );
}
