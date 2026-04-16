import { useState } from "react";
import { TopBar } from "./TopBar";
import { Camera, FileText, ClipboardPaste, Shield, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, MessageCircle, Download } from "lucide-react";

interface ContractScanProps {
  onNav: (screen: string, data?: Record<string, unknown>) => void;
}

const SCAN_RESULTS = [
  {
    id: "balloon",
    level: "red" as const,
    icon: "🚨",
    title: "Balloon payment detected",
    plain: "At the end of 72 months you will owe a single lump sum of R42,000. This amount is NOT included in your monthly payment of R5,450.",
    detail: "The contract refers to this as a 'residual value' of 15.2% of the purchase price. Many buyers don't realise this exists until the final payment is due.",
    clause: "Clause 8.3 — Residual Value",
    action: "Ask the dealer to remove the balloon and recalculate. Your monthly will increase slightly but you'll own the car outright at the end.",
    verdict: "High risk — review before signing",
  },
  {
    id: "rate",
    level: "amber" as const,
    icon: "⚠️",
    title: "Interest rate is above prime",
    plain: "Your interest rate is 14.25%. The current prime lending rate is 11.75%. You are being charged 2.5% above prime.",
    detail: "This is within legal limits but on the higher end for someone with your credit profile. You may be able to negotiate this down.",
    clause: "Clause 4.1 — Finance Charges",
    action: "Ask the dealer: 'Can you match prime + 1.5%?' If they say no, take your pre-approval to a different dealer.",
    verdict: "Worth negotiating before signing",
  },
  {
    id: "totalcost",
    level: "amber" as const,
    icon: "💰",
    title: "Total cost of credit",
    plain: "The car costs R219,900. By the time you finish paying, you will have paid R387,240 in total — R167,340 in interest alone.",
    detail: "Over 72 months at 14.25%, your interest cost nearly equals the deposit on a small home.",
    clause: "Clause 5 — Total Amount Payable",
    action: "Consider a shorter term (60 months) or a larger deposit to reduce total interest paid.",
    verdict: "Informational — important to know",
  },
  {
    id: "addons",
    level: "amber" as const,
    icon: "📦",
    title: "3 add-on products bundled in",
    plain: "Your monthly payment includes R890/month in products you may not have specifically agreed to: Credit Life (R420/mo), Extended Warranty (R290/mo), Tyre & Rim (R180/mo).",
    detail: "These products are optional by law. Over 72 months these add-ons cost R64,080 — nearly 30% of the car's cash price.",
    clause: "Schedule B — Optional Products",
    action: "Ask the F&I manager to remove each product one at a time and explain what you're losing.",
    verdict: "Review each product individually",
  },
  {
    id: "fees",
    level: "green" as const,
    icon: "✓",
    title: "Initiation and service fees are standard",
    plain: "Once-off initiation fee of R1,207 and monthly admin fee of R69. These are standard NCA-regulated amounts.",
    detail: "The monthly service fee of R69 costs R4,968 over 72 months — worth knowing, but not a red flag.",
    clause: "Clause 3.2 — Fees",
    action: "No action needed. These are within legal limits.",
    verdict: "Standard — no concern",
  },
  {
    id: "settlement",
    level: "green" as const,
    icon: "✓",
    title: "No early settlement penalty",
    plain: "You can pay off this car early at any time without being charged a penalty.",
    detail: "This is a positive clause. Some contracts include early termination fees. This one does not.",
    clause: "Clause 11 — Early Settlement",
    action: "No action needed. This is in your favour.",
    verdict: "Good — no penalty to settle early",
  },
];

const levelStyles = {
  red: { bg: "bg-danger-bg", border: "border-danger/40", text: "text-danger", dot: "bg-danger-bg" },
  amber: { bg: "bg-warning-bg", border: "border-warning/40", text: "text-warning", dot: "bg-warning-bg" },
  green: { bg: "bg-success-bg", border: "border-success/40", text: "text-success", dot: "bg-success-bg" },
};

function ScanRow({ item, expanded, onToggle }: { item: typeof SCAN_RESULTS[0]; expanded: boolean; onToggle: () => void }) {
  const s = levelStyles[item.level];
  return (
    <div className={`rounded-2xl border-[1.5px] overflow-hidden mb-2.5 bg-card transition-colors ${expanded ? s.border : "border-sand"}`}>
      <button onClick={onToggle} className="w-full flex gap-3 p-4 cursor-pointer items-start bg-transparent border-none text-left font-body">
        <div className={`w-8 h-8 rounded-full ${s.dot} flex items-center justify-center text-sm shrink-0`}>{item.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground m-0 mb-0.5">{item.title}</p>
          <p className={`text-xs font-medium m-0 ${s.text}`}>{item.verdict}</p>
        </div>
        {expanded ? <ChevronUp size={16} className="text-soft shrink-0 mt-1" /> : <ChevronDown size={16} className="text-soft shrink-0 mt-1" />}
      </button>
      {expanded && (
        <div className="border-t border-sand px-4 pb-4 pt-3">
          <div className={`${s.bg} border ${s.border} rounded-xl px-3.5 py-3 mb-3`}>
            <p className={`text-[10px] font-bold uppercase tracking-[1px] mb-1.5 ${s.text}`}>In plain English</p>
            <p className="text-[13px] text-foreground leading-relaxed m-0 font-medium">{item.plain}</p>
          </div>
          <p className="text-xs text-soft leading-relaxed mb-3">{item.detail}</p>
          <span className="text-[10px] text-soft bg-muted rounded-md px-2 py-1 font-semibold inline-block mb-3">Found in: {item.clause}</span>
          {item.level !== "green" && (
            <div className="bg-foreground rounded-xl px-3.5 py-3">
              <p className="text-[10px] font-bold text-terra-light uppercase tracking-[1px] mb-1.5">What to do</p>
              <p className="text-[13px] text-card/70 leading-relaxed m-0">{item.action}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ContractScan({ onNav }: ContractScanProps) {
  const [phase, setPhase] = useState<"intro" | "scanning" | "results">("intro");
  const [expanded, setExpanded] = useState<string | null>("balloon");
  const [progress, setProgress] = useState(0);

  function startScan() {
    setPhase("scanning");
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18;
      if (p >= 100) { p = 100; clearInterval(interval); setTimeout(() => setPhase("results"), 600); }
      setProgress(Math.min(p, 100));
    }, 280);
  }

  const reds = SCAN_RESULTS.filter(r => r.level === "red");
  const ambers = SCAN_RESULTS.filter(r => r.level === "amber");
  const greens = SCAN_RESULTS.filter(r => r.level === "green");

  const scanSteps = [
    { label: "Reading document structure", done: progress > 15 },
    { label: "Identifying loan terms", done: progress > 35 },
    { label: "Scanning for balloon payments", done: progress > 55 },
    { label: "Checking interest rate vs prime", done: progress > 70 },
    { label: "Reviewing bundled products", done: progress > 85 },
    { label: "Generating your plain-English report", done: progress >= 100 },
  ];

  return (
    <div className="bg-background min-h-screen">
      <TopBar title="Protection AI Contract Scan" onBack={() => onNav("vehicleSearch")} />

      {/* INTRO */}
      {phase === "intro" && (
        <div className="px-5 pt-5 pb-8 max-w-md mx-auto">
          <h1 className="font-heading text-2xl font-bold text-foreground leading-tight mb-2">
            Before you sign <span className="text-terra italic">anything</span> — let us read it first.
          </h1>
          <p className="text-sm text-soft leading-relaxed mb-6">
            Finance contracts are written by lawyers for banks. We translate them into plain English and flag anything that could hurt you.
          </p>

          <p className="text-[11px] uppercase tracking-[1.5px] text-soft mb-3 font-semibold">What we scan for</p>
          <div className="flex flex-col gap-2 mb-6">
            {[
              { icon: "🚨", label: "Balloon payments", desc: "Hidden lump sums at end of term" },
              { icon: "📈", label: "Interest rate vs prime", desc: "Whether you're paying too much" },
              { icon: "💰", label: "Total cost of credit", desc: "What you'll really pay in total" },
              { icon: "📦", label: "Bundled add-ons", desc: "Products you may not have agreed to" },
              { icon: "🏦", label: "Fees and charges", desc: "Initiation, admin, and hidden costs" },
              { icon: "🔒", label: "Early settlement terms", desc: "Whether you can pay off early" },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="flex gap-3 items-center bg-card border border-sand rounded-xl px-3.5 py-3">
                <span className="text-lg shrink-0">{icon}</span>
                <div>
                  <p className="text-[13px] font-semibold text-foreground m-0">{label}</p>
                  <p className="text-[11px] text-soft m-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[13px] font-semibold text-foreground mb-3">How would you like to share the contract?</p>
          <div className="flex flex-col gap-2.5">
            {[
              { icon: Camera, label: "Take a photo", sub: "Point your camera at any page" },
              { icon: FileText, label: "Upload a PDF", sub: "Share the file you received" },
              { icon: ClipboardPaste, label: "Paste the text", sub: "Copy and paste from your email" },
            ].map(o => (
              <button key={o.label} onClick={startScan} className="bg-card border-[1.5px] border-sand rounded-xl px-4 py-3.5 flex gap-3 items-center cursor-pointer text-left font-body hover:border-terra/40 transition-colors w-full">
                <o.icon size={22} className="text-terra shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground m-0">{o.label}</p>
                  <p className="text-xs text-soft m-0">{o.sub}</p>
                </div>
                <span className="text-terra text-lg">→</span>
              </button>
            ))}
          </div>

          <div className="bg-info-bg border border-info/30 rounded-xl px-3.5 py-3 mt-5 flex gap-2 items-start">
            <Shield size={14} className="text-info shrink-0 mt-0.5" />
            <p className="text-xs text-info leading-relaxed m-0">
              <strong>Your contract is never stored or shared.</strong> It is read, analysed, and deleted immediately.
            </p>
          </div>
        </div>
      )}

      {/* SCANNING */}
      {phase === "scanning" && (
        <div className="px-6 pt-12 pb-8 max-w-sm mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center mx-auto mb-6 text-3xl">🔍</div>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">Reading your contract</h2>
          <p className="text-sm text-soft mb-8">This takes about 10 seconds</p>

          <div className="bg-sand rounded-full h-1.5 mb-8">
            <div className="h-full bg-terra rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
          </div>

          <div className="flex flex-col gap-2 text-left">
            {scanSteps.map(({ label, done }) => (
              <div key={label} className={`flex gap-2.5 items-center transition-opacity duration-400 ${done ? "opacity-100" : "opacity-30"}`}>
                <span className="text-sm">{done ? "✓" : "○"}</span>
                <span className={`text-[13px] ${done ? "text-foreground font-medium" : "text-soft"}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESULTS */}
      {phase === "results" && (
        <div className="px-5 pt-5 pb-8 max-w-md mx-auto">
          {/* Verdict banner */}
          <div className="bg-danger-bg border-[1.5px] border-danger/40 rounded-2xl p-4 mb-5">
            <p className="text-[11px] uppercase tracking-[1.5px] text-danger font-bold mb-1.5">Scan complete · Do not sign yet</p>
            <h2 className="font-heading text-xl font-bold text-foreground leading-tight mb-2">We found 1 serious issue and 3 things to review</h2>
            <p className="text-[13px] text-soft leading-relaxed m-0">There is a balloon payment in this contract that most people miss. Read the red flag below before doing anything else.</p>
          </div>

          {/* Score summary */}
          <div className="flex gap-2 mb-5">
            <div className="flex-1 bg-danger-bg border border-danger/30 rounded-xl p-3 text-center">
              <p className="font-heading text-2xl font-bold text-danger m-0">{reds.length}</p>
              <p className="text-[11px] text-danger font-semibold m-0">High risk</p>
            </div>
            <div className="flex-1 bg-warning-bg border border-warning/30 rounded-xl p-3 text-center">
              <p className="font-heading text-2xl font-bold text-warning m-0">{ambers.length}</p>
              <p className="text-[11px] text-warning font-semibold m-0">Review</p>
            </div>
            <div className="flex-1 bg-success-bg border border-success/30 rounded-xl p-3 text-center">
              <p className="font-heading text-2xl font-bold text-success m-0">{greens.length}</p>
              <p className="text-[11px] text-success font-semibold m-0">Clear</p>
            </div>
          </div>

          {/* Results grouped */}
          <p className="text-[11px] uppercase tracking-[1.5px] text-danger font-bold mb-2.5">High risk — act before signing</p>
          {reds.map(r => <ScanRow key={r.id} item={r} expanded={expanded === r.id} onToggle={() => setExpanded(expanded === r.id ? null : r.id)} />)}

          <p className="text-[11px] uppercase tracking-[1.5px] text-warning font-bold mt-4 mb-2.5">Review before signing</p>
          {ambers.map(r => <ScanRow key={r.id} item={r} expanded={expanded === r.id} onToggle={() => setExpanded(expanded === r.id ? null : r.id)} />)}

          <p className="text-[11px] uppercase tracking-[1.5px] text-success font-bold mt-4 mb-2.5">All clear</p>
          {greens.map(r => <ScanRow key={r.id} item={r} expanded={expanded === r.id} onToggle={() => setExpanded(expanded === r.id ? null : r.id)} />)}

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2.5">
            <button className="w-full py-3.5 rounded-full bg-foreground text-card border-none text-sm font-bold cursor-pointer flex items-center justify-center gap-2">
              <MessageCircle size={14} /> Talk to an advisor about this
            </button>
            <button className="w-full py-3.5 rounded-full bg-card border-[1.5px] border-sand text-soft text-sm font-semibold cursor-pointer flex items-center justify-center gap-2">
              <Download size={14} /> Download my scan report
            </button>
            <button onClick={() => setPhase("intro")} className="w-full py-3 bg-transparent border-none text-soft text-[13px] cursor-pointer">
              Scan a different contract
            </button>
          </div>

          <div className="bg-warning-bg border border-warning/30 rounded-xl px-3.5 py-3 mt-5">
            <p className="text-[13px] text-warning leading-relaxed m-0 font-medium">
              ⏱ <strong>Don't sign under pressure.</strong> Any dealer who says "this offer expires today" is using a sales tactic. Legitimate deals are available tomorrow too.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
