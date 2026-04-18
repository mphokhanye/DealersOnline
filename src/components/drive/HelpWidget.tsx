import { useState } from "react";
import { HelpCircle, X, MessageCircle, Phone } from "lucide-react";

export interface HelpTopic {
  q: string;
  a: string;
}

interface HelpWidgetProps {
  context: "prequal" | "vehicles" | "offers";
  title?: string;
  topics: HelpTopic[];
}

const CONTEXT_META: Record<HelpWidgetProps["context"], { label: string; intro: string }> = {
  prequal: {
    label: "Help with your results",
    intro: "Questions about your snapshot? Here's what people usually ask.",
  },
  vehicles: {
    label: "Help choosing a car",
    intro: "Not sure where to start? These tips help you compare smarter.",
  },
  offers: {
    label: "Help with bank offers",
    intro: "Comparing finance offers can be confusing — here's what to look at first.",
  },
};

export function HelpWidget({ context, title, topics }: HelpWidgetProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(0);
  const meta = CONTEXT_META[context];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open help"
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-terra text-primary-foreground border-none shadow-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
      >
        <HelpCircle size={22} />
      </button>

      {/* Sheet */}
      {open && (
        <div
          className="fixed inset-0 bg-foreground/40 z-50 flex items-end justify-center animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-card rounded-t-2xl w-full max-w-md max-h-[85vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-3 flex items-start justify-between border-b border-sand">
              <div className="flex-1">
                <p className="text-[10px] font-bold text-terra uppercase tracking-wider mb-1">
                  Need a hand?
                </p>
                <h3 className="font-heading text-lg font-bold text-foreground m-0">
                  {title || meta.label}
                </h3>
                <p className="text-xs text-soft mt-1 m-0">{meta.intro}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close help"
                className="w-8 h-8 rounded-full bg-muted border-none flex items-center justify-center cursor-pointer text-soft hover:text-foreground transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Topics */}
            <div className="overflow-y-auto px-5 py-4 flex-1">
              <div className="flex flex-col gap-2">
                {topics.map((t, i) => {
                  const isOpen = active === i;
                  return (
                    <div
                      key={i}
                      className={`rounded-xl border-[1.5px] overflow-hidden transition-colors ${
                        isOpen ? "border-terra/40 bg-muted/40" : "border-sand bg-card"
                      }`}
                    >
                      <button
                        onClick={() => setActive(isOpen ? null : i)}
                        className="w-full px-4 py-3 flex items-center justify-between gap-3 cursor-pointer bg-transparent border-none text-left"
                      >
                        <span className="text-sm font-semibold text-foreground">{t.q}</span>
                        <span className="text-soft text-lg leading-none shrink-0">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-3 pt-0">
                          <p className="text-[13px] text-soft leading-relaxed m-0">{t.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact actions */}
            <div className="px-5 py-4 border-t border-sand bg-muted/30 flex flex-col gap-2">
              <p className="text-[11px] text-soft uppercase tracking-wider font-semibold m-0">
                Still need help?
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-card border-[1.5px] border-sand rounded-full py-2.5 text-xs font-semibold text-foreground cursor-pointer hover:border-terra transition-colors flex items-center justify-center gap-1.5">
                  <MessageCircle size={14} className="text-terra" />
                  Chat to us
                </button>
                <button className="flex-1 bg-foreground text-card border-none rounded-full py-2.5 text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                  <Phone size={14} />
                  Request callback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const HELP_CONTENT = {
  prequal: [
    {
      q: "What does my credit score mean?",
      a: "Your credit score reflects how reliably you've handled credit in the past. 'Good' means banks see you as a low-risk borrower and you'll likely qualify for better interest rates.",
    },
    {
      q: "How is my approval amount calculated?",
      a: "We look at your net monthly income, existing debts, and credit profile. Banks typically allow your total monthly debt repayments to stay below 30–35% of your take-home pay.",
    },
    {
      q: "Will this affect my credit score?",
      a: "No. This is a soft check — only you can see it. A hard check only happens once you apply for a specific finance offer.",
    },
    {
      q: "Can I change my budget?",
      a: "Yes. Use the 'I'd like to spend less' option to set your own monthly limit. We'll filter cars to match.",
    },
    {
      q: "What if I'm not happy with the result?",
      a: "Request a callback and an advisor will help you understand your options — including paying down debt, adding a co-applicant, or saving for a deposit.",
    },
  ],
  vehicles: [
    {
      q: "How do I compare cars properly?",
      a: "Don't just compare price — look at total monthly cost (instalment + fuel + insurance), service plan status, and mileage. Tap 'View more' on any card for the full picture.",
    },
    {
      q: "What's a good mileage for a used car?",
      a: "Average is roughly 20,000 km per year. A 5-year-old car with under 100,000 km is generally well-kept. Anything over 150,000 km may need bigger services soon.",
    },
    {
      q: "Service plan vs warranty — what's the difference?",
      a: "A service plan covers scheduled maintenance (oil, filters). A warranty covers mechanical failures. Both add real value to a used car — confirm what's included before you commit.",
    },
    {
      q: "Should I trade in my current car?",
      a: "Tap the 'Trade-in' button on a card to estimate your settlement. A trade-in can lower your deposit needed and reduce your monthly instalment.",
    },
    {
      q: "Why does my match score matter?",
      a: "It's based on your needs analysis — budget, family size, fuel preference, and use case. Higher scores mean the car fits more of what you told us matters.",
    },
  ],
  offers: [
    {
      q: "How do I pick the best offer?",
      a: "Don't only look at the monthly instalment. Compare the total cost of credit (what you'll really pay), interest rate, balloon, and which add-ons are bundled in.",
    },
    {
      q: "What is a balloon payment?",
      a: "A lump sum due at the end of your contract. It lowers your monthly payment but you'll owe a big amount at the end — which you'll need to pay, refinance, or trade the car for.",
    },
    {
      q: "Why are interest rates different?",
      a: "Each bank prices risk differently. The 'recommended' offer is usually the best balance of rate, fees, and total cost — but always check that the term suits you.",
    },
    {
      q: "What are value-added products (VAPs)?",
      a: "Optional extras like credit life insurance, GAP cover, or tyre & rim cover. Some are useful, others may not be worth it. You have the right to decline each one.",
    },
    {
      q: "Can I negotiate the offer?",
      a: "Yes. You can ask the bank to match a lower rate, drop add-ons, or waive fees. Having multiple offers in hand gives you leverage.",
    },
    {
      q: "What happens after I accept?",
      a: "The bank does a final affordability check, then sends a contract. We strongly recommend running it through our AI Contract Scan before signing.",
    },
  ],
};
