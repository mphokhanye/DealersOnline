import { useState } from "react";
import { TopBar } from "./TopBar";

interface NeedsAnalysisProps {
  query: string;
  answers: Record<string, string>;
  onNav: (screen: string, data?: Record<string, unknown>) => void;
}

export function NeedsAnalysis({ query, answers, onNav }: NeedsAnalysisProps) {
  const [step, setStep] = useState(0);
  const [na, setNa] = useState<Record<string, string>>({});

  const financeQs = [
    {
      key: "prequal",
      q: "Would you like to pre-qualify now?",
      info: "We only need your name, ID number, and net income.",
      opts: ["Yes — check my eligibility", "Not yet — show me cars first"],
    },
  ];

  const cashQs = [
    {
      key: "maxspend",
      q: "What's the most you'd like to spend?",
      opts: ["Under R80,000", "R80,000 – R150,000", "R150,000 – R250,000", "Over R250,000"],
    },
    {
      key: "discounted",
      q: "Do you prefer discounted or demo cars?",
      opts: ["Yes — show me the best deals", "No — I prefer standard stock"],
    },
  ];

  const qs = answers?.paymenttype === "cash" ? cashQs : financeQs;
  const cur = qs[step];

  function pick(val: string) {
    const newNa = { ...na, [cur.key]: val };
    setNa(newNa);
    if (cur.key === "prequal" && val === "Yes — check my eligibility") {
      onNav("prequal", { query, answers, na: newNa });
    } else if (step < qs.length - 1) {
      setTimeout(() => setStep(s => s + 1), 280);
    } else {
      onNav("vehicleSearch", { query, answers, na: newNa, prequalified: false });
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <TopBar onBack={() => onNav("profiling", { query })} />
      <div className="px-5 pt-5 pb-8 max-w-md mx-auto">
        <h2 className="font-heading text-xl font-bold text-foreground mb-2">{cur.q}</h2>

        {cur.info && (
          <div className="bg-terra/10 border border-terra/20 rounded-lg px-3.5 py-2.5 mb-4">
            <p className="text-xs text-terra leading-relaxed m-0">💡 {cur.info}</p>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {cur.opts.map(o => (
            <button
              key={o}
              onClick={() => pick(o)}
              className={`text-left rounded-xl px-4 py-3.5 cursor-pointer font-body transition-all duration-200 border-[1.5px] text-sm font-medium ${
                na[cur.key] === o
                  ? "bg-terra/10 border-terra text-foreground"
                  : "bg-card border-sand text-foreground hover:border-terra/40"
              }`}
            >
              {o}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-1.5 mt-6">
          {qs.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-5 bg-terra" : i < step ? "w-1.5 bg-terra" : "w-1.5 bg-sand"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
