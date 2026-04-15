import { useState } from "react";
import { TopBar } from "./TopBar";
import { Sparkles, Info } from "lucide-react";

interface NeedsAnalysisProps {
  query: string;
  answers: Record<string, string>;
  onNav: (screen: string, data?: Record<string, unknown>) => void;
}

interface NeedsQuestion {
  key: string;
  q: string;
  info?: string;
  infoDetail?: string;
  opts: string[];
  showIf?: (a: Record<string, string>) => boolean;
}

export function NeedsAnalysis({ query, answers, onNav }: NeedsAnalysisProps) {
  const [step, setStep] = useState(0);
  const [na, setNa] = useState<Record<string, string>>({});
  const [showExplain, setShowExplain] = useState(false);

  const financeQs: NeedsQuestion[] = [
    {
      key: "balloon",
      q: "Are you open to a balloon payment?",
      info: "A balloon payment reduces your monthly but means a lump sum at the end.",
      infoDetail: "We'll check if this model holds its value well — that's key to whether a balloon makes sense for you.",
      opts: ["No balloon — full repayment", "Yes, I'm open to it", "Explain this to me first"],
    },
    {
      key: "prequal",
      q: "Would you like to pre-qualify now?",
      info: "We only need your name, ID number, and net income.",
      opts: ["Yes — check my eligibility", "Not yet — show me cars first"],
    },
  ];

  const cashQs: NeedsQuestion[] = [
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
    if (val === "Explain this to me first") {
      setShowExplain(true);
      return;
    }
    setShowExplain(false);
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
      <TopBar title="drive." />
      <div className="px-5 pt-5 pb-8 max-w-md mx-auto">
        <div className="bg-card border border-sand rounded-xl px-4 py-3 mb-5 flex gap-2.5 items-start">
          <Sparkles size={16} className="text-terra shrink-0 mt-0.5" />
          <p className="text-[13px] text-mid leading-relaxed m-0">
            We'd like to personalise your experience. A few quick questions.
          </p>
        </div>

        <p className="text-[11px] uppercase tracking-[1.5px] text-soft mb-1 font-semibold">Needs analysis</p>
        <h2 className="font-heading text-xl text-foreground mb-2">{cur.q}</h2>

        {cur.info && (
          <div className="bg-warning-bg border border-warning/30 rounded-lg px-3.5 py-2.5 mb-4">
            <p className="text-xs text-warning leading-relaxed m-0">💡 {cur.info}</p>
          </div>
        )}

        {showExplain && cur.infoDetail && (
          <div className="bg-info-bg border border-info/30 rounded-lg px-3.5 py-2.5 mb-4 animate-fade-in">
            <div className="flex gap-2 items-start">
              <Info size={14} className="text-info shrink-0 mt-0.5" />
              <p className="text-xs text-info leading-relaxed m-0">{cur.infoDetail}</p>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => { setShowExplain(false); pick("No balloon — full repayment"); }}
                className="flex-1 bg-card border border-sand rounded-lg px-3 py-2 text-xs font-semibold text-foreground cursor-pointer font-body hover:border-terra/40 transition-colors"
              >
                No balloon
              </button>
              <button
                onClick={() => { setShowExplain(false); pick("Yes, I'm open to it"); }}
                className="flex-1 bg-terra text-primary-foreground border-none rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer font-body"
              >
                I'm open to it
              </button>
            </div>
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
