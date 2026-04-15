import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [onComplete]);

  const steps = [
    { label: "Analysing your request", done: progress > 20 },
    { label: "Matching preferences", done: progress > 50 },
    { label: "Preparing questions", done: progress > 80 },
  ];

  return (
    <div className="bg-dark min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full text-center">
        {/* Animated circle */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="40" fill="none" className="stroke-primary-foreground/10" strokeWidth="3" />
            <circle
              cx="48" cy="48" r="40"
              fill="none"
              className="stroke-terra"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={251}
              strokeDashoffset={251 - (Math.min(progress, 100) / 100) * 251}
              style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 size={24} className="text-terra animate-spin" />
          </div>
        </div>

        <h2 className="font-heading text-xl text-primary-foreground mb-2">
          We're analysing your request
        </h2>
        <p className="text-sm text-soft mb-8">It will only take a few seconds</p>

        {/* Steps */}
        <div className="flex flex-col gap-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-500 ${
                step.done
                  ? "bg-primary-foreground/[0.08]"
                  : "bg-transparent"
              }`}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-500 ${
                step.done ? "bg-terra" : "bg-primary-foreground/20"
              }`} />
              <span className={`text-sm transition-colors duration-500 ${
                step.done ? "text-primary-foreground/80" : "text-primary-foreground/30"
              }`}>
                {step.label}
              </span>
              {step.done && <span className="ml-auto text-terra text-xs">✓</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
