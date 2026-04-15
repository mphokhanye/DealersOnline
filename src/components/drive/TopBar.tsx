import { ArrowLeft } from "lucide-react";

interface TopBarProps {
  title?: string;
  onBack?: () => void;
}

export function TopBar({ title, onBack }: TopBarProps) {
  return (
    <div className="bg-dark px-5 py-3.5 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2.5">
        {onBack && (
          <button onClick={onBack} className="text-soft hover:text-terra transition-colors p-0 bg-transparent border-none cursor-pointer">
            <ArrowLeft size={18} />
          </button>
        )}
        <span className="font-heading text-xl text-terra tracking-wide">{title || "drive."}</span>
      </div>
    </div>
  );
}
