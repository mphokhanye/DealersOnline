import { useState } from "react";
import { TopBar } from "./TopBar";
import { Camera, FileText, ClipboardPaste, Shield, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, MessageCircle, Download } from "lucide-react";

interface ContractScanProps {
  onNav: (screen: string, data?: Record<string, unknown>) => void;
}

type ScanItem = {
  id: string;
  level: "red" | "amber" | "green";
  icon: string;
  title: string;
  plain: string;
  detail: string;
  clause: string;
  action: string;
  verdict: string;
  question?: {
    prompt: string;
    yesResponse: string;
    noResponse: string;
  };
};

const SCAN_RESULTS: ScanItem[] = [
  {
    id: "balloon",
    level: "red",
    icon: "🎈",
    title: "Balloon payment included",
    plain: "At the end of 72 months there is a single lump sum of R42,000 owing. This amount is separate from your monthly payment of R5,450.",
    detail: "The contract refers to this as a 'residual value' of 15.2% of the purchase price. Some buyers choose this to keep monthlies low — others prefer to own the car outright at the end.",
    clause: "Clause 8.3 — Residual Value",
    action: "If the balloon was your choice, you're all set. If not, ask us to remove it and recalculate — your monthly will go up slightly but you'll own the car outright at the end.",
    verdict: "Good to confirm with us",
    question: {
      prompt: "Did you request a balloon payment in your deal?",
      yesResponse: "Perfect — you're in control. Balloon payments are a valid choice when you want lower monthlies and plan to refinance, trade in or settle the lump sum at the end.",
      noResponse: "No problem. Ask us: \"Please remove the balloon and recalculate my instalment without it.\" You'll own the car outright at the end with no surprise lump sum.",
    },
  },
  {
    id: "rate",
    level: "amber",
    icon: "📈",
    title: "Interest rate vs your credit profile",
    plain: "Your interest rate is 14.25%. The current prime lending rate is 11.75%, so you're at prime + 2.5%.",
    detail: "Based on your credit profile, you may qualify for a better rate. Banks often have room to move, especially when you ask.",
    clause: "Clause 4.1 — Finance Charges",
    action: "You have a strong credit score. If you'd like your rate reviewed for a better offer, ask us or tap Yes below to request a review.",
    verdict: "You may qualify for a better rate",
    question: {
      prompt: "Would you like us to request a rate review for you?",
      yesResponse: "Great — we'll flag this with our F&I manager. A simple script: \"My credit profile qualifies for a better rate. Can you match prime + 1.5%?\" Most dealers will revisit the offer.",
      noResponse: "No problem. If you change your mind, you can always ask us directly — it costs nothing to ask and you're well within your rights.",
    },
  },
  {
    id: "totalcost",
    level: "amber",
    icon: "💰",
    title: "Total cost of credit",
    plain: "The car costs R219,900. Over the full 72 months you'll pay R387,240 in total — R167,340 of that is interest.",
    detail: "This is normal for a 6-year finance deal, but it's useful to see the full picture so you can decide if a shorter term or larger deposit might suit you better.",
    clause: "Clause 5 — Total Amount Payable",
    action: "If you'd like to see what a 60-month term or a bigger deposit would look like, we can quickly recalculate for you.",
    verdict: "Good to know — your choice",
    question: {
      prompt: "Would you like to see alternative term options?",
      yesResponse: "Smart move. Ask: \"Can you show me the same deal over 60 months, and again with R20,000 more deposit?\" You'll see exactly how much interest you'd save.",
      noResponse: "All good — the current term works for many buyers. Lower monthlies often matter more than total interest, especially early in your career.",
    },
  },
  {
    id: "addons",
    level: "amber",
    icon: "📦",
    title: "3 add-on products bundled in",
    plain: "Your monthly includes R890/month in optional products: Credit Life (R420/mo), Extended Warranty (R290/mo), Tyre & Rim (R180/mo).",
    detail: "These are optional by law and some buyers value the peace of mind. Over 72 months they add R64,080 to the deal, so it's worth confirming each one is something you actually want.",
    clause: "Schedule B — Optional Products",
    action: "If you chose these intentionally, you're set. If you'd like to review them, we can walk through each one and explain what you'd be giving up by removing it.",
    verdict: "Confirm each product is what you want",
    question: {
      prompt: "Did you knowingly choose all three add-on products?",
      yesResponse: "Perfect — these can be valuable. Credit Life settles the loan if something happens to you, and a warranty can save you on repairs. You're making an informed choice.",
      noResponse: "Easy fix. Ask: \"Please walk me through each add-on and remove any I didn't specifically request.\" You're allowed to remove them individually — it's your right under the NCA.",
    },
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

function ScanRow({ item, expanded, onToggle }: { item: ScanItem; expanded: boolean; onToggle: () => void }) {
  const s = levelStyles[item.level];
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
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

          {item.question && (
            <div className="bg-muted/40 border border-sand rounded-xl px-3.5 py-3 mb-3">
              <p className="text-[13px] font-semibold text-foreground m-0 mb-2.5">{item.question.prompt}</p>
              {answer === null ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setAnswer("yes")}
                    className="flex-1 py-2 rounded-full bg-card border-[1.5px] border-sand text-foreground text-xs font-semibold cursor-pointer hover:border-terra/40 transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setAnswer("no")}
                    className="flex-1 py-2 rounded-full bg-card border-[1.5px] border-sand text-foreground text-xs font-semibold cursor-pointer hover:border-terra/40 transition-colors"
                  >
                    No
                  </button>
                </div>
              ) : (
                <div className={`${answer === "yes" ? "bg-success-bg border-success/30" : "bg-info-bg border-info/30"} border rounded-lg px-3 py-2.5`}>
                  <p className="text-[10px] font-bold uppercase tracking-[1px] mb-1 text-foreground/70">
                    {answer === "yes" ? "You said yes" : "You said no"}
                  </p>
                  <p className="text-[13px] text-foreground leading-relaxed m-0">
                    {answer === "yes" ? item.question.yesResponse : item.question.noResponse}
                  </p>
                  <button
                    onClick={() => setAnswer(null)}
                    className="text-[11px] text-soft underline cursor-pointer bg-transparent border-none p-0 mt-2"
                  >
                    Change my answer
                  </button>
                </div>
              )}
            </div>
          )}

          {item.level !== "green" && !item.question && (
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
          <div className="bg-info-bg border-[1.5px] border-info/40 rounded-2xl p-4 mb-5">
            <p className="text-[11px] uppercase tracking-[1.5px] text-info font-bold mb-1.5">Scan complete · You're informed</p>
            <h2 className="font-heading text-xl font-bold text-foreground leading-tight mb-2">Here's what we found in your contract</h2>
            <p className="text-[13px] text-soft leading-relaxed m-0">A few items are worth a quick conversation with us. Tap each one to see what it means and answer a quick question — we'll guide you from there.</p>
          </div>

          {/* Score summary */}
          <div className="flex gap-2 mb-5">
            <div className="flex-1 bg-info-bg border border-info/30 rounded-xl p-3 text-center">
              <p className="font-heading text-2xl font-bold text-info m-0">{reds.length}</p>
              <p className="text-[11px] text-info font-semibold m-0">Confirm</p>
            </div>
            <div className="flex-1 bg-warning-bg border border-warning/30 rounded-xl p-3 text-center">
              <p className="font-heading text-2xl font-bold text-warning m-0">{ambers.length}</p>
              <p className="text-[11px] text-warning font-semibold m-0">Review</p>
            </div>
            <div className="flex-1 bg-success-bg border border-success/30 rounded-xl p-3 text-center">
              <p className="font-heading text-2xl font-bold text-success m-0">{greens.length}</p>
              <p className="text-[11px] text-success font-semibold m-0">All good</p>
            </div>
          </div>

          {/* Results grouped */}
          <p className="text-[11px] uppercase tracking-[1.5px] text-info font-bold mb-2.5">Worth confirming with us</p>
          {reds.map(r => <ScanRow key={r.id} item={r} expanded={expanded === r.id} onToggle={() => setExpanded(expanded === r.id ? null : r.id)} />)}

          <p className="text-[11px] uppercase tracking-[1.5px] text-warning font-bold mt-4 mb-2.5">Good to review</p>
          {ambers.map(r => <ScanRow key={r.id} item={r} expanded={expanded === r.id} onToggle={() => setExpanded(expanded === r.id ? null : r.id)} />)}

          <p className="text-[11px] uppercase tracking-[1.5px] text-success font-bold mt-4 mb-2.5">All good</p>
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

          <div className="bg-info-bg border border-info/30 rounded-xl px-3.5 py-3 mt-5">
            <p className="text-[13px] text-info leading-relaxed m-0 font-medium">
              💡 <strong>Take your time.</strong> A good deal is still a good deal tomorrow. Use these answers to walk into our showroom feeling confident and in control.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
