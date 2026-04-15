interface ScoreCircleProps {
  label: string;
  value: string;
  colorClass: string;
  percentage: number;
}

export function ScoreCircle({ label, value, colorClass, percentage }: ScoreCircleProps) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colorMap: Record<string, { stroke: string; text: string }> = {
    success: { stroke: "stroke-success", text: "text-success" },
    warning: { stroke: "stroke-warning", text: "text-warning" },
    info: { stroke: "stroke-info", text: "text-info" },
    danger: { stroke: "stroke-danger", text: "text-danger" },
  };

  const c = colorMap[colorClass] || colorMap.info;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[76px] h-[76px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76">
          <circle cx="38" cy="38" r={radius} fill="none" className="stroke-sand" strokeWidth="4" />
          <circle
            cx="38" cy="38" r={radius}
            fill="none"
            className={c.stroke}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[10px] font-bold tracking-wide text-center leading-tight px-1 ${c.text}`}>
            {value}
          </span>
        </div>
      </div>
      <span className="text-[10px] text-soft text-center max-w-[72px]">{label}</span>
    </div>
  );
}
