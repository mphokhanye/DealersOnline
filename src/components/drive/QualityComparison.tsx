import { useState } from "react";
import { ArrowLeft } from "lucide-react";

// White & teal theme palette
const C = {
  bg: "#FFFFFF",
  surface: "#F8FAFB",
  surface2: "#F1F5F6",
  border: "#E2E8EB",
  borderStrong: "#CBD5D8",
  ink: "#0F172A",
  ink2: "#334155",
  muted: "#64748B",
  soft: "#94A3B8",
  teal: "#0D9488",
  tealDark: "#0F766E",
  tealLight: "#5EEAD4",
  tealBg: "#ECFDF5",
  green: "#15803D",
  greenBg: "#DCFCE7",
  amber: "#B45309",
  amberBg: "#FEF3C7",
  red: "#B91C1C",
  redBg: "#FEE2E2",
  // Per-car accents (still teal-family vs slate)
  magnite: "#0D9488",   // teal
  magniteBg: "#ECFDF5",
  tcross: "#1E3A8A",    // deep slate-blue, complements teal
  tcrossBg: "#EEF2FF",
};

type CarKey = "magnite" | "tcross";

const CARS = {
  magnite: {
    id: "magnite",
    name: "Nissan Magnite",
    variant: "1.0 Turbo Acenta Plus CVT",
    priceNew: 359900,
    priceUsed: 229900,
    year: 2024,
    color: C.magnite,
    bg: C.magniteBg,
    engine: "1.0L 3-cyl Turbo",
    power: "74kW / 160Nm",
    fuel: "5.9L/100km claimed",
    gearbox: "CVT",
    serviceInterval: "10,000km or 12 months",
    maintenanceCost: "Low — R2,800–R4,200/service",
    safetyRating: "5-star Global NCAP (2024 facelift)",
    warranty: "3yr/100,000km",
    insuranceEst: 2100,
    resale5yr: 115000,
    driveQuality: 6.5,
    buildQuality: 6.0,
    reliability: 6.8,
    comfort: 7.0,
    runningCosts: 8.5,
    ownership: 7.0,
    knownIssues: [
      { level: "amber", issue: "CVT transmission sensitivity", detail: "The CVT can feel rubbery under hard acceleration. Some owners report hesitation in traffic. Avoid aggressive driving — this transmission rewards gentle inputs." },
      { level: "amber", issue: "Sensor errors on early models", detail: "Pre-facelift Magnites had sensor warning light issues. The 2024 facelift addressed this. Buy 2024+ to avoid this pattern." },
      { level: "amber", issue: "Underwhelming top-end power", detail: "The 1.0T runs out of pull above 120km/h. Fine for city and moderate highway but not for sustained high-speed cruising." },
      { level: "green", issue: "Low service costs", detail: "Parts are affordable and widely available. Independent mechanics can service these — you're not locked into the dealer network." },
      { level: "green", issue: "5-star NCAP (2024)", detail: "Nissan upgraded the safety structure significantly in the 2024 facelift. The updated car is meaningfully safer than pre-2024 models." },
      { level: "red", issue: "Build quality inconsistency", detail: "Multiple owners report panel flex and fitment inconsistencies. The 2024 facelift improved this but it remains a relative weakness vs German rivals." },
    ],
    ownerVerdict: "Best for: budget-conscious buyers who want maximum features per rand and don't drive aggressively. Weakest when pushed hard or compared closely to German interior quality.",
    whoShouldBuy: ["First-time buyer on a tight budget", "City and suburban commuter", "Buyer who prioritises features over driving feel", "Buyer who wants low service costs"],
    whoShouldAvoid: ["Anyone who drives on SA highways daily at 120km/h+", "Buyers who want a long-term 10-year car", "Anyone sensitive to interior material quality"],
  },
  tcross: {
    id: "tcross",
    name: "VW T-Cross",
    variant: "1.0 TSI 85kW Style DSG",
    priceNew: 489900,
    priceUsed: 319900,
    year: 2025,
    color: C.tcross,
    bg: C.tcrossBg,
    engine: "1.0L 3-cyl TSI Turbo",
    power: "85kW / 200Nm",
    gearbox: "7-speed DSG",
    fuel: "6.5L/100km real-world",
    serviceInterval: "15,000km or 12 months",
    maintenanceCost: "Higher — R4,500–R7,000/service",
    safetyRating: "5-star Euro NCAP",
    warranty: "3yr/120,000km",
    insuranceEst: 2800,
    resale5yr: 185000,
    driveQuality: 8.5,
    buildQuality: 8.0,
    reliability: 7.8,
    comfort: 8.0,
    runningCosts: 6.5,
    ownership: 8.2,
    knownIssues: [
      { level: "amber", issue: "DSG gearbox in stop-start traffic", detail: "The 7-speed DSG can judder and hesitate at very low speeds. This is a known characteristic, not a defect. It improves with driving style adaptation." },
      { level: "amber", issue: "Electrical gremlins on older models", detail: "What Car? found 15% of T-Cross owners reported issues, mainly electrics. VW covered 83% of repairs under warranty. Buy new or recent and this risk reduces significantly." },
      { level: "amber", issue: "Service costs are real", detail: "VW dealer servicing costs noticeably more than Nissan. A service plan is strongly recommended — roll it into the finance from day one to avoid bill shock." },
      { level: "green", issue: "Build quality that holds up", detail: "Scored 98% in the What Car? reliability survey. The German engineering shows in how the car ages — better after 3 years vs after 3 months." },
      { level: "green", issue: "Resale value advantage", detail: "VW's brand equity translates to money at resale. The T-Cross holds value significantly better than most Asian rivals at this price point." },
      { level: "green", issue: "DSG + TSI combination", detail: "Despite the stop-start DSG quirk, the 85kW TSI + DSG combination is genuinely enjoyable on open roads. More confident at highway speeds than the Magnite's CVT." },
    ],
    ownerVerdict: "Best for: buyers who want a long-term car, value driving quality daily, and can absorb slightly higher running costs. The premium is real — but so is what you get for it.",
    whoShouldBuy: ["Buyer prioritising long-term ownership quality", "Highway commuter — Joburg to Pretoria daily", "Buyer who can include a service plan in finance", "Buyer who wants strong resale protection"],
    whoShouldAvoid: ["Buyers stretched to afford the T-Cross", "Joburg peak-hour-only city drivers bothered by DSG judder", "Anyone who needs maximum features per rand"],
  },
} as const;

const TABS = [
  { id: "head2head", label: "Head to head", icon: "⚔️" },
  { id: "quality", label: "Quality scores", icon: "🏆" },
  { id: "issues", label: "Known issues", icon: "🔧" },
  { id: "ownership", label: "Ownership", icon: "📅" },
  { id: "verdict", label: "Verdict", icon: "⚖️" },
];

function CarBadge({ car, active, onClick }: { car: CarKey; active: boolean; onClick: () => void }) {
  const c = CARS[car];
  return (
    <div onClick={onClick} style={{
      flex: 1, background: active ? c.bg : C.surface,
      border: `1.5px solid ${active ? c.color : C.border}`,
      borderRadius: 14, padding: "12px 14px", cursor: "pointer", transition: "all 0.2s"
    }}>
      <p style={{ fontSize: 10, color: active ? c.color : C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 3px" }}>{c.name.split(" ")[0]}</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: C.ink, margin: "0 0 4px", lineHeight: 1.2 }}>{c.name.split(" ").slice(1).join(" ")}</p>
      <p style={{ fontSize: 16, fontWeight: 700, color: c.color, margin: 0 }}>R{(c.priceNew / 1000).toFixed(0)}k+</p>
    </div>
  );
}

function ScoreBar({ label, magnite, tcross, higherIsBetter = true }: { label: string; magnite: number; tcross: number; higherIsBetter?: boolean }) {
  const mWins = higherIsBetter ? magnite >= tcross : magnite <= tcross;
  const tWins = higherIsBetter ? tcross > magnite : tcross < magnite;
  const max = 10;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: C.ink2, fontWeight: 500 }}>{label}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: mWins ? C.magnite : C.muted }}>{magnite}/10</span>
          <span style={{ fontSize: 12, color: C.borderStrong }}>·</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: tWins ? C.tcross : C.muted }}>{tcross}/10</span>
        </div>
      </div>
      <div style={{ position: "relative", height: 20, display: "flex", gap: 4, alignItems: "center" }}>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ height: 8, width: `${(magnite / max) * 100}%`, background: mWins ? C.magnite : C.borderStrong, borderRadius: "4px 0 0 4px", transition: "width 0.6s ease" }} />
        </div>
        <div style={{ width: 1, height: 16, background: C.border, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 8, width: `${(tcross / max) * 100}%`, background: tWins ? C.tcross : C.borderStrong, borderRadius: "0 4px 4px 0", transition: "width 0.6s ease" }} />
        </div>
      </div>
    </div>
  );
}

function IssueCard({ issue }: { issue: { level: string; issue: string; detail: string } }) {
  const [open, setOpen] = useState(false);
  const levelStyle = ({
    green: { bg: C.greenBg, color: C.green, icon: "✓" },
    amber: { bg: C.amberBg, color: C.amber, icon: "⚠" },
    red: { bg: C.redBg, color: C.red, icon: "✕" },
  } as const)[issue.level as "green" | "amber" | "red"];
  return (
    <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 8, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "11px 14px", cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: levelStyle.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0, color: levelStyle.color, fontWeight: 700 }}>
          {levelStyle.icon}
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, flex: 1, margin: 0 }}>{issue.issue}</p>
        <span style={{ color: C.muted, fontSize: 16 }}>{open ? "−" : "+"}</span>
      </div>
      {open && (
        <div style={{ padding: "0 14px 12px 46px" }}>
          <p style={{ fontSize: 12, color: C.ink2, lineHeight: 1.7, margin: 0 }}>{issue.detail}</p>
        </div>
      )}
    </div>
  );
}

function OwnershipTimeline({ car }: { car: CarKey }) {
  const c = CARS[car];
  const events = ({
    magnite: [
      { month: 6, event: "First service due", type: "service", cost: "~R3,200" },
      { month: 10, event: "Second service", type: "service", cost: "~R3,200" },
      { month: 14, event: "Third service", type: "service", cost: "~R3,500" },
      { month: 36, event: "Warranty expires", type: "warning", cost: "Risk increases" },
      { month: 48, event: "Tyres likely due", type: "cost", cost: "~R8,000 set" },
      { month: 60, event: "Est. resale value", type: "resale", cost: `R${c.resale5yr.toLocaleString()}` },
    ],
    tcross: [
      { month: 12, event: "First service due", type: "service", cost: "~R5,500" },
      { month: 24, event: "Second service", type: "service", cost: "~R5,500" },
      { month: 36, event: "Third service", type: "service", cost: "~R6,000" },
      { month: 36, event: "Warranty continues", type: "green", cost: "3yr/120,000km" },
      { month: 48, event: "DSG fluid change rec.", type: "cost", cost: "~R4,500" },
      { month: 60, event: "Est. resale value", type: "resale", cost: `R${c.resale5yr.toLocaleString()}` },
    ],
  } as const)[car];

  const typeStyle = {
    service: { color: C.teal, bg: C.tealBg, icon: "🔧" },
    warning: { color: C.red, bg: C.redBg, icon: "⚠" },
    cost: { color: C.amber, bg: C.amberBg, icon: "💰" },
    resale: { color: C.green, bg: C.greenBg, icon: "📈" },
    green: { color: C.green, bg: C.greenBg, icon: "✓" },
  } as const;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: 16, top: 0, bottom: 0, width: 1, background: C.border }} />
      {events.map((ev, i) => {
        const ts = typeStyle[ev.type as keyof typeof typeStyle];
        return (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14, position: "relative" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: ts.bg, border: `1.5px solid ${ts.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, zIndex: 1 }}>
              {ts.icon}
            </div>
            <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.ink, margin: 0 }}>{ev.event}</p>
                <span style={{ fontSize: 11, fontWeight: 700, color: ts.color }}>{ev.cost}</span>
              </div>
              <p style={{ fontSize: 10, color: C.muted, margin: "2px 0 0" }}>Month {ev.month}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface QualityComparisonProps {
  onNav?: (screen: string, data?: Record<string, unknown>) => void;
}

export function QualityComparison({ onNav }: QualityComparisonProps) {
  const [tab, setTab] = useState("head2head");
  const [focusCar, setFocusCar] = useState<CarKey | null>(null);

  const m = CARS.magnite;
  const t = CARS.tcross;

  const headToHead = [
    { label: "Starting price (new)", m: `R${(m.priceNew/1000).toFixed(0)}k`, t: `R${(t.priceNew/1000).toFixed(0)}k`, winner: "magnite", note: "R130k gap" },
    { label: "Power", m: m.power, t: t.power, winner: "tcross", note: "11kW more" },
    { label: "Gearbox", m: "CVT", t: "7-spd DSG", winner: "tcross", note: "DSG more engaging" },
    { label: "Service interval", m: "10,000km", t: "15,000km", winner: "tcross", note: "50% less frequent" },
    { label: "Service cost", m: "R3,200–R4,200", t: "R5,500–R7,000", winner: "magnite", note: "~R2,000 cheaper" },
    { label: "Warranty", m: "3yr/100k", t: "3yr/120k", winner: "tcross", note: "20k more cover" },
    { label: "Safety rating", m: "5★ NCAP (2024)", t: "5★ Euro NCAP", winner: "draw", note: "Both excellent" },
    { label: "Dealer network", m: "42 dealers", t: "93 dealers", winner: "tcross", note: "More than 2× coverage" },
    { label: "5-yr resale", m: `~R${(m.resale5yr/1000).toFixed(0)}k`, t: `~R${(t.resale5yr/1000).toFixed(0)}k`, winner: "tcross", note: "R70k stronger" },
    { label: "Insurance est.", m: `R${m.insuranceEst.toLocaleString()}/pm`, t: `R${t.insuranceEst.toLocaleString()}/pm`, winner: "magnite", note: "R700/pm less" },
  ];

  const showM = focusCar !== "tcross";
  const showT = focusCar !== "magnite";

  return (
    <div style={{ background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", color: C.ink }}>
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }`}</style>

      {/* Header */}
      <div style={{ background: C.bg, padding: "16px 18px 14px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {onNav && (
              <button onClick={() => onNav("compareIntro")} style={{ background: "none", border: "none", color: C.ink2, cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}>
                <ArrowLeft size={18} />
              </button>
            )}
            <span style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>Find<span style={{ color: C.teal }}>&</span>Drive.</span>
          </div>
          <span style={{ fontSize: 10, color: C.tealDark, background: C.tealBg, border: `1px solid ${C.teal}40`, borderRadius: 100, padding: "3px 10px", fontWeight: 600 }}>Quality comparison</span>
        </div>

        <div style={{ background: C.tealBg, border: `1px solid ${C.teal}30`, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
          <p style={{ fontSize: 12, color: C.ink2, lineHeight: 1.65, margin: 0 }}>
            What it's actually like to <span style={{ color: C.tealDark, fontWeight: 700 }}>own each car</span> — build quality, reliability patterns, known issues, and the real cost of ownership over 5 years.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <CarBadge car="magnite" active={focusCar === "magnite" || !focusCar} onClick={() => setFocusCar(focusCar === "magnite" ? null : "magnite")} />
          <CarBadge car="tcross" active={focusCar === "tcross" || !focusCar} onClick={() => setFocusCar(focusCar === "tcross" ? null : "tcross")} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex" }}>
        {TABS.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{
            flex: 1, padding: "10px 4px", border: "none", background: "none",
            borderBottom: tab === tb.id ? `2px solid ${C.teal}` : "2px solid transparent",
            color: tab === tb.id ? C.tealDark : C.muted,
            fontSize: 9, fontWeight: tab === tb.id ? 700 : 500, cursor: "pointer",
            fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center", gap: 3
          }}>
            <span style={{ fontSize: 14 }}>{tb.icon}</span>
            {tb.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "18px", animation: "fadeUp 0.3s ease" }}>

        {tab === "head2head" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center", marginBottom: 12 }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.magnite, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Magnite</p>
              </div>
              <div style={{ minWidth: 70 }} />
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.tcross, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>T-Cross</p>
              </div>
            </div>

            {headToHead.map(({ label, m: mv, t: tv, winner, note }) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 6, marginBottom: 6, alignItems: "center" }}>
                <div style={{ background: winner === "magnite" ? C.magniteBg : C.surface, border: `1px solid ${winner === "magnite" ? C.magnite : C.border}`, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                  <p style={{ fontSize: 12, fontWeight: winner === "magnite" ? 700 : 500, color: winner === "magnite" ? C.magnite : C.ink2, margin: 0 }}>{mv}</p>
                  {winner === "magnite" && <p style={{ fontSize: 9, color: C.magnite, margin: "2px 0 0", fontWeight: 700 }}>WINS</p>}
                </div>
                <div style={{ textAlign: "center", minWidth: 70 }}>
                  <p style={{ fontSize: 9, color: C.tealDark, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700 }}>{label}</p>
                  <p style={{ fontSize: 9, color: C.muted, margin: 0 }}>{note}</p>
                </div>
                <div style={{ background: winner === "tcross" ? C.tcrossBg : C.surface, border: `1px solid ${winner === "tcross" ? C.tcross : C.border}`, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                  <p style={{ fontSize: 12, fontWeight: winner === "tcross" ? 700 : 500, color: winner === "tcross" ? C.tcross : C.ink2, margin: 0 }}>{tv}</p>
                  {winner === "tcross" && <p style={{ fontSize: 9, color: C.tcross, margin: "2px 0 0", fontWeight: 700 }}>WINS</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "quality" && (
          <div>
            <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, margin: "0 0 16px" }}>
              Independent scores synthesised from owner reviews, reliability surveys and long-term tests. Higher is better — except running costs (where higher = cheaper to run).
            </p>
            <ScoreBar label="Drive quality" magnite={m.driveQuality} tcross={t.driveQuality} />
            <ScoreBar label="Build quality" magnite={m.buildQuality} tcross={t.buildQuality} />
            <ScoreBar label="Reliability" magnite={m.reliability} tcross={t.reliability} />
            <ScoreBar label="Comfort" magnite={m.comfort} tcross={t.comfort} />
            <ScoreBar label="Running costs (cheap = high)" magnite={m.runningCosts} tcross={t.runningCosts} />
            <ScoreBar label="Overall ownership" magnite={m.ownership} tcross={t.ownership} />
          </div>
        )}

        {tab === "issues" && (
          <div>
            {showM && (
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.magnite, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>Magnite — known patterns</p>
                {m.knownIssues.map((iss, i) => <IssueCard key={i} issue={iss} />)}
              </div>
            )}
            {showT && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.tcross, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>T-Cross — known patterns</p>
                {t.knownIssues.map((iss, i) => <IssueCard key={i} issue={iss} />)}
              </div>
            )}
          </div>
        )}

        {tab === "ownership" && (
          <div>
            <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.6, margin: "0 0 14px" }}>
              What the next 5 years look like — services, warranty milestones and resale value.
            </p>
            {showM && (
              <div style={{ marginBottom: 22 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.magnite, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px" }}>Magnite — 5 year journey</p>
                <OwnershipTimeline car="magnite" />
              </div>
            )}
            {showT && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: C.tcross, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px" }}>T-Cross — 5 year journey</p>
                <OwnershipTimeline car="tcross" />
              </div>
            )}
          </div>
        )}

        {tab === "verdict" && (
          <div>
            {[m, t].map((car) => (
              <div key={car.id} style={{ background: car.bg, border: `1px solid ${car.color}40`, borderRadius: 14, padding: "14px 16px", marginBottom: 14 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: car.color, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px" }}>{car.name}</p>
                <p style={{ fontSize: 13, color: C.ink, lineHeight: 1.65, margin: "0 0 12px" }}>{car.ownerVerdict}</p>

                <p style={{ fontSize: 10, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px" }}>Who should buy</p>
                <ul style={{ margin: "0 0 12px", paddingLeft: 18 }}>
                  {car.whoShouldBuy.map((w, i) => (
                    <li key={i} style={{ fontSize: 12, color: C.ink2, lineHeight: 1.6 }}>{w}</li>
                  ))}
                </ul>

                <p style={{ fontSize: 10, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px" }}>Who should avoid</p>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {car.whoShouldAvoid.map((w, i) => (
                    <li key={i} style={{ fontSize: 12, color: C.ink2, lineHeight: 1.6 }}>{w}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default QualityComparison;
