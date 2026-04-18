import { useState, useRef, TouchEvent } from "react";
import { TopBar } from "./TopBar";
import { ChevronLeft, ChevronRight, CheckCircle, Shield } from "lucide-react";
import { HelpWidget, HELP_CONTENT } from "./HelpWidget";

interface BankOffersProps {
  car: { make: string; model: string; year: number; price: string };
  onNav: (screen: string, data?: Record<string, unknown>) => void;
  onClose: () => void;
}

const OFFERS = [
  {
    id: 1,
    bank: "ABSA",
    recommended: true,
    purchasePrice: "R219,900",
    monthly: "R4,120",
    term: "72 months",
    rate: "11.25%",
    balloon: "R0",
    balloonPercent: "0%",
    insurance: "R389/mo",
    vaps: "Credit life + GAP",
    delivery: "R1,950",
    initiation: "R1,207.50",
    totalCost: "R298,760",
    saving: "Best overall deal",
  },
  {
    id: 2,
    bank: "Standard Bank",
    recommended: false,
    purchasePrice: "R219,900",
    monthly: "R4,280",
    term: "72 months",
    rate: "12.00%",
    balloon: "R0",
    balloonPercent: "0%",
    insurance: "R420/mo",
    vaps: "Credit life",
    delivery: "R2,200",
    initiation: "R1,207.50",
    totalCost: "R310,360",
    saving: "",
  },
  {
    id: 3,
    bank: "FNB",
    recommended: false,
    purchasePrice: "R219,900",
    monthly: "R3,650",
    term: "72 months",
    rate: "11.75%",
    balloon: "R44,000",
    balloonPercent: "20%",
    insurance: "R410/mo",
    vaps: "Credit life + Tyre & Rim",
    delivery: "Free",
    initiation: "R1,207.50",
    totalCost: "R307,800",
    saving: "Lowest monthly",
  },
  {
    id: 4,
    bank: "Nedbank",
    recommended: false,
    purchasePrice: "R219,900",
    monthly: "R4,450",
    term: "60 months",
    rate: "12.50%",
    balloon: "R0",
    balloonPercent: "0%",
    insurance: "R395/mo",
    vaps: "Credit life",
    delivery: "R1,800",
    initiation: "R1,207.50",
    totalCost: "R291,207",
    saving: "Shortest term",
  },
];

function OfferRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-sand last:border-b-0">
      <span className="text-xs text-soft">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-terra" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

export function BankOffers({ car, onNav, onClose }: BankOffersProps) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const offer = OFFERS[current];

  function handleTouchStart(e: TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchMove(e: TouchEvent) {
    touchEndX.current = e.touches[0].clientX;
  }

  function handleTouchEnd() {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && current < OFFERS.length - 1) setCurrent(c => c + 1);
      if (diff < 0 && current > 0) setCurrent(c => c - 1);
    }
  }

  function prev() {
    if (current > 0) setCurrent(c => c - 1);
  }
  function next() {
    if (current < OFFERS.length - 1) setCurrent(c => c + 1);
  }

  return (
    <div className="bg-background min-h-screen">
      <TopBar title="Bank Offers" onBack={onClose} />
      <div className="px-5 pt-4 pb-8 max-w-md mx-auto">
        <p className="text-sm text-soft mb-1">{car.year} {car.make} {car.model} · {car.price}</p>
        <p className="text-xs text-soft mb-4">Swipe to compare offers</p>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={prev} disabled={current === 0} className={`w-8 h-8 rounded-full border border-sand flex items-center justify-center bg-card cursor-pointer transition-opacity ${current === 0 ? "opacity-30" : "hover:border-terra"}`}>
            <ChevronLeft size={16} className="text-foreground" />
          </button>
          <div className="flex gap-1.5">
            {OFFERS.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all duration-300 border-none cursor-pointer ${i === current ? "w-6 bg-terra" : "w-2 bg-sand"}`} />
            ))}
          </div>
          <button onClick={next} disabled={current === OFFERS.length - 1} className={`w-8 h-8 rounded-full border border-sand flex items-center justify-center bg-card cursor-pointer transition-opacity ${current === OFFERS.length - 1 ? "opacity-30" : "hover:border-terra"}`}>
            <ChevronRight size={16} className="text-foreground" />
          </button>
        </div>

        {/* Offer card */}
        <div
          className="animate-fade-in"
          key={offer.id}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={`bg-card border-[1.5px] rounded-2xl overflow-hidden ${offer.recommended ? "border-success" : "border-sand"}`}>
            {/* Header */}
            <div className={`px-5 py-4 flex items-center justify-between ${offer.recommended ? "bg-success-bg" : "bg-muted"}`}>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-lg font-bold text-foreground m-0">{offer.bank}</h3>
                  {offer.recommended && (
                    <span className="bg-success text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle size={10} /> RECOMMENDED
                    </span>
                  )}
                </div>
                {offer.saving && <p className="text-xs text-success font-medium mt-0.5 m-0">{offer.saving}</p>}
              </div>
            </div>

            {/* Monthly highlight */}
            <div className="px-5 py-4 border-b border-sand text-center">
              <p className="text-xs text-soft mb-1 m-0">Monthly instalment</p>
              <p className="font-heading text-3xl font-bold text-terra m-0">{offer.monthly}</p>
              <p className="text-xs text-soft mt-1 m-0">{offer.term} · {offer.rate} interest</p>
            </div>

            {/* Contract details */}
            <div className="px-5 py-1">
              <OfferRow label="Purchase price" value={offer.purchasePrice} />
              <OfferRow label="Term" value={offer.term} />
              <OfferRow label="Interest rate" value={offer.rate} />
              <OfferRow label="Balloon payment" value={offer.balloon === "R0" ? "None" : `${offer.balloon} (${offer.balloonPercent})`} />
              <OfferRow label="Insurance" value={offer.insurance} />
              <OfferRow label="Value-added products" value={offer.vaps} />
              <OfferRow label="Delivery fee" value={offer.delivery} />
              <OfferRow label="Initiation fee" value={offer.initiation} />
              <OfferRow label="Total cost of credit" value={offer.totalCost} highlight />
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-sand">
              <button className="w-full bg-terra text-primary-foreground border-none rounded-full py-3.5 text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Shield size={14} />
                Accept this offer
              </button>
              <p className="text-[10px] text-soft text-center mt-2 m-0">Subject to final bank approval · T&Cs apply</p>
            </div>
          </div>
        </div>

        {/* Offer count */}
        <p className="text-xs text-soft text-center mt-4">{current + 1} of {OFFERS.length} offers</p>
      </div>
      <HelpWidget context="offers" topics={HELP_CONTENT.offers} />
    </div>
  );
}
