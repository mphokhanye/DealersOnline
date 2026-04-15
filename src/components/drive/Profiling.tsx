import { useState } from "react";
import { TopBar } from "./TopBar";

interface ProfilingProps {
  query: string;
  onNav: (screen: string, data?: Record<string, unknown>) => void;
}

interface Question {
  key: string;
  guide: string;
  q: string;
  opts: { val: string; label: string; sub: string }[];
  showIf?: (a: Record<string, string>) => boolean;
}

export function Profiling({ query, onNav }: ProfilingProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions: Question[] = [
    {
      key: "firsttime",
      guide: "",
      q: "Is this your first car?",
      opts: [
        { val: "yes", label: "Yes — my first car", sub: "I'll need some guidance" },
        { val: "no", label: "No, I've bought before", sub: "I know how it works" },
      ],
    },
    {
      key: "timeline",
      guide: "Good to know. When are you looking to buy?",
      q: "What's your buying timeline?",
      opts: [
        { val: "now", label: "Ready to buy now", sub: "I want to move quickly" },
        { val: "months", label: "Few months away", sub: "Getting finances in order" },
        { val: "research", label: "Just researching", sub: "Not sure yet — need guidance" },
      ],
    },
    {
      key: "paymenttype",
      guide: "Perfect. Now let's understand how you'd like to pay.",
      q: "Finance or cash?",
      opts: [
        { val: "finance", label: "Finance deal", sub: "I'll pay monthly over time" },
        { val: "cash", label: "Cash deal", sub: "I'll pay the full amount" },
      ],
    },
    {
      key: "deposit",
      guide: "One more thing — do you have a deposit available?",
      q: "Do you have a deposit?",
      opts: [
        { val: "yes10", label: "Yes — 10% or more", sub: "Improves my deal significantly" },
        { val: "yes5", label: "Yes — around 5%", sub: "Modest deposit available" },
        { val: "no", label: "No deposit", sub: "I'd prefer zero deposit" },
      ],
      showIf: (a) => a.paymenttype === "finance",
    },
  ];

  const visibleQs = questions.filter(q => !q.showIf || q.showIf(answers));
  const current = visibleQs[step];

  function pick(val: string) {
    const newA = { ...answers, [current.key]: val };
    setAnswers(newA);
    if (step < visibleQs.length - 1) {
      setTimeout(() => setStep(s => s + 1), 300);
    } else {
      onNav("needs", { query, answers: newA });
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <TopBar onBack={() => onNav("landing")} />
      <div className="px-5 pt-6 pb-8 max-w-md mx-auto">
        {/* AI message bubble */}
        {step === 0 ? (
          <div className="bg-muted rounded-2xl px-4 py-3.5 mb-6 flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-terra flex items-center justify-center text-sm shrink-0 text-primary-foreground font-bold">
              F
            </div>
            <p className="text-[13px] text-foreground leading-relaxed m-0">
              We're analysing: <span className="text-terra font-medium">"{query}"</span>
            </p>
          </div>
        ) : current.guide ? (
          <div className="bg-muted rounded-2xl px-4 py-3.5 mb-6 flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-terra flex items-center justify-center text-sm shrink-0 text-primary-foreground font-bold">
              F
            </div>
            <p className="text-[13px] text-foreground leading-relaxed m-0">{current.guide}</p>
          </div>
        ) : null}

        <h2 className="font-heading text-xl font-bold text-foreground mb-4">{current.q}</h2>

        <div className="flex flex-col gap-2.5">
          {current.opts.map(o => (
            <button
              key={o.val}
              onClick={() => pick(o.val)}
              className={`text-left rounded-xl px-4 py-3.5 cursor-pointer font-body transition-all duration-200 border-[1.5px] ${
                answers[current.key] === o.val
                  ? "bg-terra/10 border-terra"
                  : "bg-card border-sand hover:border-terra/40"
              }`}
            >
              <div className="text-sm font-semibold text-foreground mb-0.5">{o.label}</div>
              <div className="text-xs text-soft">{o.sub}</div>
            </button>
          ))}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {visibleQs.map((_, i) => (
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
