import { useState } from "react";
import { ArrowLeft, X, Zap, Gauge, Fuel, Shield, Wrench, Music4, Lightbulb } from "lucide-react";
import poloTsi from "@/assets/polo-tsi.webp";
import poloGti from "@/assets/polo-gti.webp";

interface Props {
  onNav: (screen: string, data?: Record<string, unknown>) => void;
}

const T = {
  bg: "#FFFFFF",
  surface: "#F8FAFB",
  border: "#E2E8EB",
  ink: "#0F172A",
  ink2: "#334155",
  muted: "#64748B",
  teal: "#0D9488",
  tealDark: "#0F766E",
  tealBg: "#ECFDF5",
  amber: "#B45309",
  amberBg: "#FEF3C7",
};

type HotspotKey = "start" | "drive" | "engine" | "fuel" | "insurance" | "service";

interface Hotspot {
  key: HotspotKey;
  label: string;
  icon: typeof Zap;
  // Position as % of image area
  pos: { top: string; left: string };
  better: "tsi" | "gti";
  tsi: string;
  gti: string;
  insight?: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    key: "start",
    label: "Starting the car",
    icon: Music4,
    pos: { top: "55%", left: "20%" },
    better: "gti",
    tsi: "Smooth, quiet, unassuming. The 1.0 three-cylinder has a subtle vibration at idle — normal for a small engine. It settles quickly. Nothing dramatic. Perfectly pleasant.",
    gti: "The 2.0 TSI fires with a purposeful exhaust note. Not loud, but present. You feel the difference in the seat immediately — firmer, lower, more alert. It sets the tone for the drive.",
  },
  {
    key: "drive",
    label: "Driving quality",
    icon: Gauge,
    pos: { top: "40%", left: "50%" },
    better: "tsi",
    tsi: "Genuinely easy. Light clutch, predictable power delivery, soft suspension absorbs the bumps. This is where the TSI is arguably the better car for most SA buyers' actual daily reality.",
    gti: "The sports suspension is stiffer — you feel the road more. SA potholes are more noticeable. The DSG can judder in very slow stop-start traffic. Bearable, but not what the GTI was built for.",
  },
  {
    key: "engine",
    label: "Engine performance",
    icon: Zap,
    pos: { top: "55%", left: "35%" },
    better: "gti",
    tsi: "Adequate. The 70kW runs out of energy at sustained highway speed. Overtaking needs planning. Not stressful, but you're aware of its limits past 120km/h.",
    gti: "This is where the GTI becomes everything it promises. The 2.0 TSI has reserves you'll never fully use. Overtaking is instant, effortless, safe. Joburg to Durban feels genuinely different.",
    insight: "If you do a highway commute daily — Joburg to Pretoria, Durban to PMB — the GTI transforms it. If you're mostly urban, you'll rarely feel the difference.",
  },
  {
    key: "fuel",
    label: "Fuel efficiency",
    icon: Fuel,
    pos: { top: "70%", left: "75%" },
    better: "tsi",
    tsi: "Claims 4.5L/100km, real-world ~6L. On a 60L tank you're spending roughly R1,300 per fill — 2–3 weeks between stops for most urban buyers. Genuinely economical.",
    gti: "Claims 7.2L/100km but driven with any enthusiasm — which you will — expect 10L+. That's R2,200+ per fill, more often. Over a year the fuel gap vs the TSI can exceed R24,000.",
  },
  {
    key: "insurance",
    label: "Insurance cost",
    icon: Shield,
    pos: { top: "35%", left: "78%" },
    better: "tsi",
    tsi: "Comprehensive cover from R1,800–R2,400/month depending on profile, age, and area. Insurable without drama — similar to any mainstream hatchback.",
    gti: "Performance car classification pushes premiums significantly higher: R3,500–R6,500/month comprehensive. High-theft risk on VW models plus the performance factor. Under 30 makes it worse — get a quote before you buy.",
  },
  {
    key: "service",
    label: "Service & maintenance",
    icon: Wrench,
    pos: { top: "75%", left: "55%" },
    better: "tsi",
    tsi: "Service plan typically covers you to 45,000km or 3 years. Independents can service the 1.0 TSI at R3,500–R5,000 after that. Real-world data shows ~R777/month in post-warranty costs — manageable.",
    gti: "The 2.0 EA888 has a known SA issue: RON93 fuel quality causes carbon buildup, requiring valve cleaning (~45,000km and ~95,000km). Covered under plan, but post-plan it's an extra cost. Service plan is essential — include it in your finance from day one.",
  },
];

export function QualityComparison({ onNav }: Props) {
  const [active, setActive] = useState<HotspotKey | null>(null);
  const [view, setView] = useState<"tsi" | "gti">("tsi");

  const hotspot = HOTSPOTS.find(h => h.key === active);

  return (
    <div style={{ background: T.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", color: T.ink, fontFamily: "inherit" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => onNav("compareSelect")} style={{ background: "none", border: "none", color: T.ink2, cursor: "pointer", display: "flex", padding: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <span style={{ fontSize: 16, fontWeight: 700 }}>Find<span style={{ color: T.teal }}>&</span>Drive.</span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: T.tealDark, background: T.tealBg, border: `1px solid ${T.teal}40`, borderRadius: 100, padding: "3px 10px", fontWeight: 600 }}>Side-by-side</span>
      </div>

      {/* Title */}
      <div style={{ padding: "18px 20px 10px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px", lineHeight: 1.25 }}>Polo TSI vs Polo GTI</h2>
        <p style={{ fontSize: 13, color: T.muted, margin: 0, lineHeight: 1.5 }}>
          Tap any hotspot on the car to see what's different — and which one wins.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ padding: "0 20px", display: "flex", gap: 8, marginBottom: 6 }}>
        {(["tsi", "gti"] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              flex: 1, padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              cursor: "pointer", border: `1.5px solid ${view === v ? T.teal : T.border}`,
              background: view === v ? T.tealBg : T.bg,
              color: view === v ? T.tealDark : T.ink2,
            }}
          >
            {v === "tsi" ? "Polo TSI" : "Polo GTI"}
          </button>
        ))}
      </div>

      {/* Car image with hotspots */}
      <div style={{ padding: "8px 20px 0" }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
          <img
            src={view === "tsi" ? poloTsi : poloGti}
            alt={view === "tsi" ? "VW Polo TSI" : "VW Polo GTI"}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
          {HOTSPOTS.map(h => (
            <button
              key={h.key}
              onClick={() => setActive(h.key)}
              aria-label={h.label}
              style={{
                position: "absolute",
                top: h.pos.top,
                left: h.pos.left,
                transform: "translate(-50%, -50%)",
                width: 32, height: 32, borderRadius: "50%",
                background: active === h.key ? T.teal : "#fff",
                border: `2px solid ${T.teal}`,
                color: active === h.key ? "#fff" : T.teal,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", padding: 0,
                boxShadow: "0 2px 8px rgba(13,148,136,0.25)",
                animation: active === h.key ? undefined : "pulse-ring 2s ease-in-out infinite",
              }}
            >
              <h.icon size={15} />
            </button>
          ))}
        </div>

        {/* Hotspot legend chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {HOTSPOTS.map(h => (
            <button
              key={h.key}
              onClick={() => setActive(h.key)}
              style={{
                fontSize: 11, fontWeight: 600,
                padding: "6px 10px", borderRadius: 100,
                border: `1px solid ${active === h.key ? T.teal : T.border}`,
                background: active === h.key ? T.tealBg : T.bg,
                color: active === h.key ? T.tealDark : T.ink2,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <h.icon size={11} />
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div style={{ padding: "16px 20px 32px" }}>
        {!hotspot && (
          <div style={{ background: T.surface, border: `1px dashed ${T.border}`, borderRadius: 14, padding: "18px 16px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: T.muted, margin: 0, lineHeight: 1.5 }}>
              👆 Tap a hotspot above to compare both cars side-by-side.
            </p>
          </div>
        )}

        {hotspot && (
          <div style={{ animation: "fadeIn 0.25s ease-out" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: T.tealBg, color: T.teal, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <hotspot.icon size={16} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{hotspot.label}</h3>
              </div>
              <button onClick={() => setActive(null)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            <ComparisonCard
              title="Polo TSI"
              body={hotspot.tsi}
              winner={hotspot.better === "tsi"}
            />
            <div style={{ height: 10 }} />
            <ComparisonCard
              title="Polo GTI"
              body={hotspot.gti}
              winner={hotspot.better === "gti"}
            />

            {hotspot.insight && (
              <div style={{ marginTop: 12, background: T.amberBg, border: `1px solid ${T.amber}30`, borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10 }}>
                <Lightbulb size={16} color={T.amber} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 12.5, color: T.ink2, lineHeight: 1.55, margin: 0 }}>
                  <strong style={{ color: T.amber }}>Insight:</strong> {hotspot.insight}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ComparisonCard({ title, body, winner }: { title: string; body: string; winner: boolean }) {
  return (
    <div style={{
      border: `1.5px solid ${winner ? T.teal : T.border}`,
      background: winner ? T.tealBg : T.bg,
      borderRadius: 12, padding: "12px 14px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: T.ink }}>{title}</p>
        {winner && (
          <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", background: T.teal, padding: "3px 8px", borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Better here
          </span>
        )}
      </div>
      <p style={{ fontSize: 12.5, color: T.ink2, lineHeight: 1.6, margin: 0 }}>{body}</p>
    </div>
  );
}

export default QualityComparison;
