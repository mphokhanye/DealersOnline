import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, Mic, Send, CheckCircle } from "lucide-react";

interface LandingProps {
  onNav: (screen: string, data?: Record<string, unknown>) => void;
}

const TYPING_QUERIES = [
  "What interest rate will the bank give me?",
  "Best reliable car under R8,000/pm",
  "Alternatives for a Nissan Magnite?",
  "Which SUV has the lowest fuel cost?",
  "Can I afford a BMW 3 Series?",
  "I earn R30k and I want a Mercedes Benz A200. Can you help me?",
];

function useTypingAnimation() {
  const [displayText, setDisplayText] = useState("");
  const [queryIdx, setQueryIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const active = useRef(true);

  useEffect(() => {
    active.current = true;
    const q = TYPING_QUERIES[queryIdx];

    if (!deleting) {
      if (charIdx < q.length) {
        const t = setTimeout(() => setCharIdx(c => c + 1), 45);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setDeleting(true), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (charIdx > 0) {
        const t = setTimeout(() => setCharIdx(c => c - 1), 25);
        return () => clearTimeout(t);
      } else {
        setDeleting(false);
        setQueryIdx(i => (i + 1) % TYPING_QUERIES.length);
      }
    }
    return () => { active.current = false; };
  }, [charIdx, deleting, queryIdx]);

  useEffect(() => {
    setDisplayText(TYPING_QUERIES[queryIdx].slice(0, charIdx));
  }, [charIdx, queryIdx]);

  return displayText;
}

export function Landing({ onNav }: LandingProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const typingText = useTypingAnimation();

  const ctaBtns = [
    { label: "Search cars", icon: Search },
    { label: "Pre-approval", icon: CheckCircle },
    { label: "Car offers", icon: null },
    { label: "Interest rates", icon: CheckCircle },
  ];
  const examples = [
    "What interest rate will the bank give me?",
    "What better alternatives to a Nissan Magnite are available?",
    "Best reliable car under R8,000/pm",
  ];

  function submit(q: string) {
    if (!q.trim()) return;
    onNav("loading", { query: q });
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-gradient-to-b from-muted/60 to-background pb-8">
        <div className="px-5 pt-6 max-w-md mx-auto">
          <span className="font-heading text-xl font-bold text-foreground tracking-tight">Find<span className="text-terra">&</span>Drive.</span>
        </div>
        <div className="px-5 pt-16 pb-6 max-w-md mx-auto text-center">
          <p className="text-xs uppercase tracking-[3px] text-terra font-semibold mb-3">YOUR PERSONAL CAR ASSISTANT</p>
          <h1 className="font-heading text-[28px] font-bold text-foreground leading-tight mb-2">
            Your car buying journey starts with a question.<br />Any question.
          </h1>
        </div>
      </div>

      <div className="px-5 max-w-md mx-auto -mt-2">
        <div className="bg-card rounded-full px-5 py-3.5 mb-5 flex gap-3 items-center shadow-md border border-sand">
          <div className="flex-1 relative">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit(query)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full border-none outline-none text-sm text-foreground bg-transparent font-body"
            />
            {!query && !focused && (
              <span className="absolute inset-0 flex items-center text-sm text-soft pointer-events-none font-body">
                {typingText}<span className="inline-block w-[2px] h-4 bg-terra ml-0.5 animate-pulse" />
              </span>
            )}
          </div>
          <Mic size={18} className="text-soft shrink-0 cursor-pointer hover:text-terra transition-colors" />
          <button
            onClick={() => submit(query)}
            className="bg-terra text-primary-foreground border-none rounded-full w-9 h-9 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity shrink-0"
          >
            <Send size={16} />
          </button>
        </div>

        <p className="text-sm text-soft text-center mb-3">Or choose where to start:</p>
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {ctaBtns.map(b => (
            <button
              key={b.label}
              onClick={() => submit(b.label)}
              className="bg-card border border-sand text-foreground rounded-full px-4 py-2.5 text-sm font-medium cursor-pointer font-body hover:border-terra hover:text-terra transition-colors flex items-center gap-2"
            >
              {b.icon && <b.icon size={14} className="text-terra" />}
              {b.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-soft text-center mb-3">People are asking</p>
        <div className="flex flex-col gap-2">
          {examples.map(e => (
            <button
              key={e}
              onClick={() => submit(e)}
              className="bg-card border border-sand text-foreground rounded-xl px-4 py-3 text-left text-[13px] cursor-pointer font-body flex justify-between items-center hover:border-terra transition-colors group"
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
