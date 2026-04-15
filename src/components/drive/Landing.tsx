import { useState } from "react";
import { Search, ArrowRight, Sparkles } from "lucide-react";

interface LandingProps {
  onNav: (screen: string, data?: Record<string, unknown>) => void;
}

export function Landing({ onNav }: LandingProps) {
  const [query, setQuery] = useState("");
  const ctaBtns = ["Search cars", "Pre-approval", "Best deals", "Interest rates", "Car buying advice"];
  const examples = [
    "What interest rate will the bank give me?",
    "What better alternatives to a Nissan Magnite are available?",
    "Best reliable car under R8,000/month",
  ];

  function submit(q: string) {
    if (!q.trim()) return;
    onNav("loading", { query: q });
  }

  return (
    <div className="bg-dark min-h-screen">
      <div className="px-5 pt-12 pb-8 max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-terra" />
          <p className="font-heading text-[11px] tracking-[3px] text-terra uppercase">Powered by AI</p>
        </div>
        <h1 className="font-heading text-[34px] text-primary-foreground leading-tight mb-3">
          Find your <span className="text-terra italic">perfect</span><br />car. Honestly.
        </h1>
        <p className="text-sm text-soft leading-relaxed mb-8 max-w-[340px]">
          No jargon. No pressure. Ask anything — we'll guide you to the right car and the right deal.
        </p>

        {/* Search box */}
        <div className="bg-card rounded-2xl px-4 py-3.5 mb-4 flex gap-3 items-center shadow-lg">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit(query)}
            placeholder="Ask anything about cars or finance…"
            className="flex-1 border-none outline-none text-sm text-foreground bg-transparent font-body"
          />
          <button
            onClick={() => submit(query)}
            className="bg-terra text-primary-foreground border-none rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
          >
            Go
          </button>
        </div>

        {/* Quick CTAs */}
        <div className="flex gap-2 flex-wrap mb-7">
          {ctaBtns.map(b => (
            <button
              key={b}
              onClick={() => submit(b)}
              className="bg-primary-foreground/[0.08] border border-primary-foreground/[0.14] text-soft rounded-full px-3.5 py-2 text-xs font-medium cursor-pointer font-body hover:bg-primary-foreground/[0.14] transition-colors"
            >
              {b}
            </button>
          ))}
        </div>

        {/* Example queries */}
        <p className="text-[10px] uppercase tracking-[1.5px] text-mid/60 mb-3 font-semibold">People are asking</p>
        <div className="flex flex-col gap-2">
          {examples.map(e => (
            <button
              key={e}
              onClick={() => submit(e)}
              className="bg-primary-foreground/[0.05] border border-primary-foreground/[0.10] text-soft rounded-xl px-4 py-3 text-left text-[13px] cursor-pointer font-body flex justify-between items-center hover:bg-primary-foreground/[0.08] transition-colors group"
            >
              <span>"{e}"</span>
              <ArrowRight size={14} className="text-terra shrink-0 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
