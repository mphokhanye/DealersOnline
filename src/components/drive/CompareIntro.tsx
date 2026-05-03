import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";

interface CompareIntroProps {
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
};

type Step = "needs1" | "needs2" | "needs3" | "prequal" | "select";

const CARS = [
  { id: "magnite", name: "Nissan Magnite", variant: "1.0 Turbo Acenta Plus CVT", price: "from R359,900", tag: "Budget-friendly" },
  { id: "tcross", name: "VW T-Cross", variant: "1.0 TSI 85kW Style DSG", price: "from R489,900", tag: "Premium quality" },
];

export function CompareIntro({ onNav }: CompareIntroProps) {
  const [step, setStep] = useState<Step>("needs1");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [picked, setPicked] = useState<string[]>([]);

  function answer(key: string, val: string, next: Step) {
    setAnswers(a => ({ ...a, [key]: val }));
    setTimeout(() => setStep(next), 220);
  }

  function togglePick(id: string) {
    setPicked(p => p.includes(id) ? p.filter(x => x !== id) : p.length >= 2 ? p : [...p, id]);
  }

  const stepIndex = ["needs1", "needs2", "needs3", "prequal", "select"].indexOf(step);

  function backNav() {
    if (step === "needs1") onNav("landing");
    else if (step === "needs2") setStep("needs1");
    else if (step === "needs3") setStep("needs2");
    else if (step === "prequal") setStep("needs3");
    else if (step === "select") setStep("prequal");
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", color: T.ink, fontFamily: "inherit" }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={backNav} style={{ background: "none", border: "none", color: T.ink2, cursor: "pointer", display: "flex", padding: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <span style={{ fontSize: 16, fontWeight: 700 }}>Find<span style={{ color: T.teal }}>&</span>Drive.</span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: T.tealDark, background: T.tealBg, border: `1px solid ${T.teal}40`, borderRadius: 100, padding: "3px 10px", fontWeight: 600 }}>Compare cars</span>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "16px 0 8px" }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            height: 6, borderRadius: 6,
            width: i === stepIndex ? 24 : 6,
            background: i <= stepIndex ? T.teal : T.border,
            transition: "all 0.3s",
          }} />
        ))}
      </div>

      <div style={{ padding: "20px 20px 32px" }}>
        {(step === "needs1" || step === "needs2" || step === "needs3") && (
          <NeedsStep
            step={step}
            answers={answers}
            onAnswer={answer}
          />
        )}

        {step === "prequal" && (
          <div>
            <p style={{ fontSize: 11, color: T.tealDark, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 8px" }}>Step 4 of 5</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.25 }}>Want to get pre-qualified first?</h2>
            <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.6, margin: "0 0 20px" }}>
              A 60-second soft check shows what you can afford — so we can highlight which of these cars actually fits your budget. It won't affect your credit score.
            </p>

            <div style={{ background: T.tealBg, border: `1px solid ${T.teal}30`, borderRadius: 12, padding: "12px 14px", marginBottom: 18 }}>
              <p style={{ fontSize: 12, color: T.ink2, lineHeight: 1.6, margin: 0 }}>
                💡 <strong>Why this helps:</strong> The Magnite and T-Cross are R130k apart in price. Knowing your approval amount makes the comparison far more useful.
              </p>
            </div>

            <button
              onClick={() => onNav("prequal", { fromCompare: true, returnTo: "compareSelect" })}
              style={{
                width: "100%", background: T.teal, color: "#fff", border: "none",
                borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 600,
                cursor: "pointer", marginBottom: 10
              }}
            >
              Yes — pre-qualify me first
            </button>
            <button
              onClick={() => setStep("select")}
              style={{
                width: "100%", background: T.bg, color: T.ink, border: `1.5px solid ${T.border}`,
                borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 600, cursor: "pointer"
              }}
            >
              Skip — go straight to comparison
            </button>
          </div>
        )}

        {step === "select" && (
          <div>
            <p style={{ fontSize: 11, color: T.tealDark, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 8px" }}>Step 5 of 5</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.25 }}>Pick the two cars to compare</h2>
            <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.6, margin: "0 0 20px" }}>
              Based on your answers, these two are your strongest matches in the compact SUV segment.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              {CARS.map(c => {
                const sel = picked.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => togglePick(c.id)}
                    style={{
                      textAlign: "left", background: sel ? T.tealBg : T.bg,
                      border: `1.5px solid ${sel ? T.teal : T.border}`,
                      borderRadius: 14, padding: "14px 16px", cursor: "pointer",
                      display: "flex", gap: 12, alignItems: "center", transition: "all 0.2s"
                    }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: 6,
                      border: `1.5px solid ${sel ? T.teal : T.border}`,
                      background: sel ? T.teal : T.bg,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                    }}>
                      {sel && <Check size={14} color="#fff" strokeWidth={3} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                        <p style={{ fontSize: 15, fontWeight: 700, margin: 0, color: T.ink }}>{c.name}</p>
                        <span style={{ fontSize: 9, fontWeight: 700, color: T.tealDark, background: T.tealBg, padding: "2px 8px", borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.5px" }}>{c.tag}</span>
                      </div>
                      <p style={{ fontSize: 12, color: T.muted, margin: "0 0 4px" }}>{c.variant}</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: T.tealDark, margin: 0 }}>{c.price}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onNav("compare")}
              disabled={picked.length !== 2}
              style={{
                width: "100%", background: picked.length === 2 ? T.teal : T.border,
                color: "#fff", border: "none", borderRadius: 12,
                padding: "14px", fontSize: 14, fontWeight: 600,
                cursor: picked.length === 2 ? "pointer" : "not-allowed"
              }}
            >
              {picked.length === 2 ? "Compare these cars →" : `Select ${2 - picked.length} more`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NeedsStep({ step, answers, onAnswer }: { step: Step; answers: Record<string, string>; onAnswer: (k: string, v: string, next: Step) => void; }) {
  const QS: Record<string, { stepLabel: string; key: string; q: string; sub: string; opts: string[]; next: Step }> = {
    needs1: {
      stepLabel: "Step 1 of 5",
      key: "use",
      q: "What will you mostly use the car for?",
      sub: "This shapes which features matter most.",
      opts: ["Daily commute (city)", "Highway driving (long trips)", "Family duties (school + errands)", "Mix of everything"],
      next: "needs2",
    },
    needs2: {
      stepLabel: "Step 2 of 5",
      key: "priority",
      q: "What matters most to you?",
      sub: "Pick the one that's hardest to compromise on.",
      opts: ["Lowest monthly payment", "Long-term reliability", "Fuel & service savings", "Driving feel & quality"],
      next: "needs3",
    },
    needs3: {
      stepLabel: "Step 3 of 5",
      key: "horizon",
      q: "How long do you plan to keep the car?",
      sub: "This affects whether resale value matters more than purchase price.",
      opts: ["Under 3 years", "3 – 5 years", "5+ years (long-term)"],
      next: "prequal",
    },
  };
  const cur = QS[step];
  return (
    <div>
      <p style={{ fontSize: 11, color: T.tealDark, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 8px" }}>{cur.stepLabel}</p>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.25 }}>{cur.q}</h2>
      <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.6, margin: "0 0 20px" }}>{cur.sub}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {cur.opts.map(o => {
          const sel = answers[cur.key] === o;
          return (
            <button
              key={o}
              onClick={() => onAnswer(cur.key, o, cur.next)}
              style={{
                textAlign: "left", background: sel ? T.tealBg : T.bg,
                border: `1.5px solid ${sel ? T.teal : T.border}`,
                borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                fontSize: 14, fontWeight: 500, color: T.ink,
                transition: "all 0.15s"
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CompareIntro;
