import { useState } from "react";
import { TopBar } from "./TopBar";
import { ScoreCircle } from "./ScoreCircle";
import { Lock, Phone } from "lucide-react";

interface PrequalProps {
  query: string;
  answers: Record<string, string>;
  na: Record<string, string>;
  onNav: (screen: string, data?: Record<string, unknown>) => void;
}

export function Prequal({ query, answers, na, onNav }: PrequalProps) {
  const [phase, setPhase] = useState<"form" | "loading" | "results">("form");
  const [form, setForm] = useState({ name: "Lerato", surname: "Dlamini", id: "9801010001089", income: "22000" });

  function submit() {
    setPhase("loading");
    setTimeout(() => setPhase("results"), 2000);
  }

  if (phase === "form") {
    return (
      <div className="bg-background min-h-screen">
        <TopBar title="Pre-qualification" onBack={() => onNav("needs", { query, answers, na })} />
        <div className="px-5 pt-5 pb-8 max-w-md mx-auto">
          <p className="text-sm text-mid leading-relaxed mb-5">
            We just need a few details. This is a <strong className="text-foreground">soft check</strong> — it won't affect your credit score.
          </p>
          {([["Name", "name", "Lerato"], ["Surname", "surname", "Dlamini"], ["ID Number", "id", "980101 0001 089"], ["Net Monthly Income (R)", "income", "22 000"]] as const).map(([label, key, placeholder]) => (
            <div key={key} className="mb-3.5">
              <label className="text-[11px] text-soft block mb-1.5 font-semibold uppercase tracking-wider">{label}</label>
              <input
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-4 py-3 rounded-xl border-[1.5px] border-sand text-sm text-foreground bg-card font-body outline-none focus:border-terra transition-colors"
              />
            </div>
          ))}
          <div className="bg-info-bg rounded-lg px-3.5 py-3 mb-5 flex gap-2 items-start">
            <Lock size={14} className="text-info shrink-0 mt-0.5" />
            <p className="text-xs text-info leading-relaxed m-0">Your data is used only to generate your eligibility result. We never sell your information.</p>
          </div>
          <button
            onClick={submit}
            className="w-full bg-terra text-primary-foreground border-none rounded-full px-6 py-3.5 text-sm font-semibold cursor-pointer font-body hover:opacity-90 transition-opacity"
          >
            Check my eligibility →
          </button>
        </div>
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div className="bg-dark min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90 animate-spin-slow" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" className="stroke-primary-foreground/10" strokeWidth="3" />
              <circle cx="40" cy="40" r="34" fill="none" className="stroke-terra" strokeWidth="3" strokeLinecap="round" strokeDasharray="214" strokeDashoffset="140" />
            </svg>
          </div>
          <h2 className="font-heading text-lg text-primary-foreground mb-2">Checking your eligibility</h2>
          <p className="text-sm text-soft">Running a soft credit check…</p>
        </div>
      </div>
    );
  }

  // Results
  return (
    <div className="bg-background min-h-screen">
      <TopBar title="Your results" />
      <div className="px-5 pt-5 pb-8 max-w-md mx-auto">
        <h2 className="font-heading text-2xl text-foreground mb-1">Hi, {form.name} 👋</h2>
        <p className="text-sm text-mid mb-6">Here's your financial snapshot.</p>

        {/* Score circles - fintech style */}
        <div className="flex justify-between mb-6 px-2">
          <ScoreCircle label="Credit Score" value="Good" colorClass="success" percentage={78} />
          <ScoreCircle label="Debt Level" value="Manageable" colorClass="warning" percentage={45} />
          <ScoreCircle label="Affordability" value="Average" colorClass="info" percentage={60} />
        </div>

        {/* Approval amount */}
        <div className="bg-dark rounded-2xl p-5 mb-4">
          <p className="text-[11px] text-soft uppercase tracking-[1.5px] mb-1.5 font-semibold">Estimated Approval Amount</p>
          <p className="font-heading text-4xl text-terra m-0 mb-1">R285,000</p>
          <div className="flex gap-2 items-baseline">
            <span className="text-2xl text-primary-foreground font-semibold">R5,450</span>
            <span className="text-sm text-soft">per month · 72 months</span>
          </div>
          <div className="mt-3 pt-3 border-t border-primary-foreground/10">
            <span className="text-sm text-terra-light">🚗 300 cars in your range</span>
          </div>
        </div>

        {/* Request callback */}
        <button
          onClick={() => {}}
          className="w-full bg-card border-[1.5px] border-sand rounded-xl px-4 py-3.5 mb-4 flex items-center gap-3 cursor-pointer font-body hover:border-terra/40 transition-colors"
        >
          <Phone size={18} className="text-terra" />
          <div className="text-left">
            <div className="text-sm font-semibold text-foreground">Request a callback</div>
            <div className="text-xs text-soft">An advisor will contact you</div>
          </div>
        </button>

        {/* Happy with monthly? */}
        <p className="text-[15px] font-semibold text-foreground mb-3">Are you happy with R5,450/month?</p>
        <div className="flex flex-col gap-2 mb-5">
          <button
            onClick={() => onNav("vehicleSearch", { query, answers, na, prequalified: true, monthly: 5450 })}
            className="bg-card border-[1.5px] border-sand rounded-xl px-4 py-3.5 text-left cursor-pointer font-body hover:border-success/40 transition-colors"
          >
            <div className="text-sm font-semibold text-success">✓ It's perfect — find my car</div>
            <div className="text-xs text-soft mt-0.5">Show me 300 cars in this range</div>
          </button>
          <div className="bg-card border-[1.5px] border-sand rounded-xl px-4 py-3.5">
            <div className="text-sm font-semibold text-foreground mb-2">↓ I'd like to spend less</div>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-soft">R</span>
              <input
                placeholder="Enter max monthly"
                className="flex-1 border border-sand rounded-lg px-3 py-2 text-sm font-body outline-none focus:border-terra transition-colors bg-background"
              />
              <button
                onClick={() => onNav("vehicleSearch", { query, answers, na, prequalified: true, monthly: 4200 })}
                className="bg-terra text-primary-foreground border-none rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                Set
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
