// Shared layout for generated link-preview images (1200 x 630).

export const OG_SIZE = { width: 1200, height: 630 };

export function OgCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  const fontSize = title.length > 80 ? 52 : title.length > 50 ? 62 : 72;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "linear-gradient(135deg, #0b0b0e 0%, #172033 100%)",
        color: "#f4f4f5",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: "#60a5fa", fontWeight: 600, letterSpacing: 1 }}>
        {eyebrow}
      </div>
      <div style={{ display: "flex", fontSize, fontWeight: 700, lineHeight: 1.15, maxWidth: 1000 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 28, color: "#a1a1aa" }}>
        <span>{footer}</span>
        <span style={{ color: "#f4f4f5", fontWeight: 600 }}>bryandts.netlify.app</span>
      </div>
    </div>
  );
}
