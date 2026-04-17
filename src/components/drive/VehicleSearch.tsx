import { useState } from "react";
import { TopBar } from "./TopBar";
import { BankOffers } from "./BankOffers";
import { ContractScan } from "./ContractScan";
import { Fuel, Tag, ArrowLeftRight, Search, FileCheck, CircleDollarSign, ChevronDown, ChevronUp } from "lucide-react";

interface VehicleSearchProps {
  query: string;
  answers: Record<string, string>;
  na: Record<string, string>;
  prequalified: boolean;
  monthly?: number;
  onNav: (screen: string, data?: Record<string, unknown>) => void;
}

const CARS = [
  { id: 1, make: "Toyota", model: "Corolla", year: 2020, mileage: "62,000 km", price: "R219,900", monthly: "R4,890/mo", servicePlan: true, transmission: "Auto", fuelType: "Petrol", fuel: 6.8, match: 96, tag: "Best match" },
  { id: 2, make: "Honda", model: "Civic", year: 2019, mileage: "54,000 km", price: "R198,500", monthly: "R4,420/mo", servicePlan: true, transmission: "Man", fuelType: "Petrol", fuel: 7.1, match: 91, tag: "Fuel saver" },
  { id: 3, make: "Mazda", model: "3", year: 2021, mileage: "38,000 km", price: "R249,000", monthly: "R5,380/mo", servicePlan: false, transmission: "Auto", fuelType: "Petrol", fuel: 6.5, match: 87, tag: "Premium feel" },
  { id: 4, make: "Hyundai", model: "Elantra", year: 2020, mileage: "71,000 km", price: "R179,900", monthly: "R4,010/mo", servicePlan: true, transmission: "Man", fuelType: "Diesel", fuel: 7.4, match: 83, tag: "Best price" },
  { id: 5, make: "VW", model: "Polo", year: 2021, mileage: "29,000 km", price: "R265,000", monthly: "R5,450/mo", servicePlan: true, transmission: "Auto", fuelType: "Diesel", fuel: 6.2, match: 79, tag: "Low mileage" },
];

type ModalType = "fuel" | "reduce" | "tradeIn" | "balloon" | null;

function FuelModal({ car, onClose }: { car: typeof CARS[0]; onClose: () => void }) {
  const [commute, setCommute] = useState("same");
  const fuelPrice = 21.5;
  const km = commute === "same" ? 30 * 2 * 22 : 120 * 2 * 22;
  const cost = Math.round((km / 100) * car.fuel * fuelPrice);
  return (
    <div className="fixed inset-0 bg-foreground/40 flex items-end justify-center z-50" onClick={onClose}>
      <div className="bg-card rounded-t-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="font-heading text-xl font-bold text-foreground mb-1">⛽ Fuel cost estimate</h3>
        <p className="text-[13px] text-soft mb-5">{car.year} {car.make} {car.model} · {car.fuel}L/100km</p>
        <p className="text-[13px] text-foreground font-semibold mb-2.5">Do you live and work in the same city?</p>
        <div className="flex gap-2 mb-5">
          {([["same", "Yes, same city"], ["diff", "Different cities"]] as const).map(([val, label]) => (
            <button key={val} onClick={() => setCommute(val)} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border-none transition-colors ${
              commute === val ? "bg-terra text-primary-foreground" : "bg-muted text-soft"
            }`}>{label}</button>
          ))}
        </div>
        <div className="bg-muted rounded-2xl px-5 py-4 text-center">
          <p className="text-xs text-soft mb-1 m-0">Estimated monthly fuel cost</p>
          <p className="font-heading text-4xl font-bold text-terra m-0 mb-1">R{cost.toLocaleString()}</p>
          <p className="text-[11px] text-soft m-0">Based on ~{Math.round(km).toLocaleString()} km/month · R{fuelPrice}/L</p>
        </div>
        <button onClick={onClose} className="w-full mt-4 py-3 rounded-full bg-muted text-soft border-none text-sm font-semibold cursor-pointer">Close</button>
      </div>
    </div>
  );
}

function ReducePriceModal({ car, onClose }: { car: typeof CARS[0]; onClose: () => void }) {
  const discount = Math.round(parseInt(car.price.replace(/\D/g, "")) * 0.08);
  const newPrice = parseInt(car.price.replace(/\D/g, "")) - discount;
  return (
    <div className="fixed inset-0 bg-foreground/40 flex items-end justify-center z-50" onClick={onClose}>
      <div className="bg-card rounded-t-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="font-heading text-xl font-bold text-foreground mb-1">💰 Max discount applied</h3>
        <p className="text-[13px] text-soft mb-4">{car.year} {car.make} {car.model}</p>
        <div className="bg-success-bg rounded-xl px-4 py-3 mb-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-success font-semibold">Discount</span>
            <span className="text-sm text-success font-bold">-R{discount.toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-muted rounded-2xl px-5 py-4 text-center">
          <p className="text-xs text-soft mb-1 m-0">Reduced price</p>
          <p className="font-heading text-3xl font-bold text-terra m-0">R{newPrice.toLocaleString()}</p>
        </div>
        <button onClick={onClose} className="w-full mt-4 py-3 rounded-full bg-muted text-soft border-none text-sm font-semibold cursor-pointer">Close</button>
      </div>
    </div>
  );
}

function BalloonModal({ car, onClose }: { car: typeof CARS[0]; onClose: () => void }) {
  const price = parseInt(car.price.replace(/\D/g, ""));
  const balloonPercent = 20;
  const balloonAmount = Math.round(price * balloonPercent / 100);
  const financed = price - balloonAmount;
  const r = 0.115 / 12;
  const n = 72;
  const monthlyWithBalloon = Math.round((financed * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  const monthlyWithout = Math.round((price * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  const saving = monthlyWithout - monthlyWithBalloon;
  const holdsValue = car.match > 85;

  return (
    <div className="fixed inset-0 bg-foreground/40 flex items-end justify-center z-50" onClick={onClose}>
      <div className="bg-card rounded-t-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="font-heading text-xl font-bold text-foreground mb-1">🎈 Balloon payment option</h3>
        <p className="text-[13px] text-soft mb-4">{car.year} {car.make} {car.model}</p>
        <div className="bg-terra/10 border border-terra/20 rounded-lg px-3.5 py-2.5 mb-4">
          <p className="text-xs text-terra leading-relaxed m-0">💡 A balloon reduces your monthly but means a lump sum at the end of your term.</p>
        </div>
        <div className="bg-muted rounded-xl px-4 py-3 mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-soft">Without balloon</span>
            <span className="text-sm font-semibold text-foreground">R{monthlyWithout.toLocaleString()}/mo</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-soft">With {balloonPercent}% balloon</span>
            <span className="text-sm font-bold text-terra">R{monthlyWithBalloon.toLocaleString()}/mo</span>
          </div>
        </div>
        <div className="bg-success-bg rounded-xl px-4 py-3 mb-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-success font-semibold">Monthly saving</span>
            <span className="text-sm text-success font-bold">R{saving.toLocaleString()}/mo</span>
          </div>
        </div>
        <div className="bg-muted rounded-xl px-4 py-3 mb-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-soft">Balloon due at end of term</span>
            <span className="text-sm font-semibold text-foreground">R{balloonAmount.toLocaleString()}</span>
          </div>
        </div>
        <div className={`rounded-xl px-4 py-3 mb-4 ${holdsValue ? "bg-success-bg" : "bg-warning-bg"}`}>
          <p className={`text-xs font-semibold m-0 ${holdsValue ? "text-success" : "text-warning"}`}>
            {holdsValue ? "✓ This model holds its value well — balloon is a smart option" : "⚠ This model may depreciate faster — consider carefully"}
          </p>
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-full bg-muted text-soft border-none text-sm font-semibold cursor-pointer">Close</button>
      </div>
    </div>
  );
}

function TradeInModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [repayment, setRepayment] = useState("");
  const [months, setMonths] = useState("");

  function calculate() {
    const rep = parseInt(repayment) || 0;
    const mo = parseInt(months) || 0;
    const estimatedValue = 120000;
    const settlement = Math.max(0, (rep * (72 - mo)) * 0.6);
    const equity = estimatedValue - settlement;
    setStep(equity > 0 ? 1 : equity < 0 ? 2 : 3);
  }

  if (step === 0) {
    return (
      <div className="fixed inset-0 bg-foreground/40 flex items-end justify-center z-50" onClick={onClose}>
        <div className="bg-card rounded-t-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
          <h3 className="font-heading text-xl font-bold text-foreground mb-1">🔄 Trade-in estimate</h3>
          <p className="text-[13px] text-soft mb-5">Let's estimate your current vehicle's position.</p>
          <div className="mb-3">
            <label className="text-[11px] text-soft block mb-1.5 font-semibold uppercase tracking-wider">Current monthly repayment (R)</label>
            <input value={repayment} onChange={e => setRepayment(e.target.value)} placeholder="e.g. 3500" className="w-full px-4 py-3 rounded-xl border-[1.5px] border-sand text-sm text-foreground bg-background font-body outline-none focus:border-terra transition-colors" />
          </div>
          <div className="mb-5">
            <label className="text-[11px] text-soft block mb-1.5 font-semibold uppercase tracking-wider">Months you've had the vehicle</label>
            <input value={months} onChange={e => setMonths(e.target.value)} placeholder="e.g. 36" className="w-full px-4 py-3 rounded-xl border-[1.5px] border-sand text-sm text-foreground bg-background font-body outline-none focus:border-terra transition-colors" />
          </div>
          <button onClick={calculate} className="w-full bg-terra text-primary-foreground border-none rounded-full py-3.5 text-sm font-semibold cursor-pointer">Estimate trade-in →</button>
        </div>
      </div>
    );
  }

  const messages: Record<number, { emoji: string; color: string; bg: string; title: string; desc: string }> = {
    1: { emoji: "✅", color: "text-success", bg: "bg-success-bg", title: "You already have a deposit", desc: "Your trade-in equity can be applied to your next vehicle." },
    2: { emoji: "🔄", color: "text-warning", bg: "bg-warning-bg", title: "We'll structure your deal to absorb your shortfall", desc: "Don't worry — we can roll the difference into your new deal." },
    3: { emoji: "➡️", color: "text-info", bg: "bg-info-bg", title: "You're in a clean position to switch vehicles", desc: "No outstanding balance — you're free to move forward." },
  };
  const msg = messages[step];

  return (
    <div className="fixed inset-0 bg-foreground/40 flex items-end justify-center z-50" onClick={onClose}>
      <div className="bg-card rounded-t-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className={`${msg.bg} rounded-xl px-4 py-4 mb-4`}>
          <p className="text-lg mb-1">{msg.emoji}</p>
          <h4 className={`font-semibold text-sm ${msg.color} mb-1`}>{msg.title}</h4>
          <p className={`text-xs ${msg.color} opacity-80 m-0`}>{msg.desc}</p>
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-full bg-muted text-soft border-none text-sm font-semibold cursor-pointer">Close</button>
      </div>
    </div>
  );
}

// Pre-qualify gate shown before bank offers if user skipped pre-qual
function PrequalGate({ onPrequalify, onSkip }: { onPrequalify: () => void; onSkip: () => void }) {
  return (
    <div className="fixed inset-0 bg-foreground/40 flex items-end justify-center z-50">
      <div className="bg-card rounded-t-2xl p-6 w-full max-w-md">
        <h3 className="font-heading text-xl font-bold text-foreground mb-2">Pre-qualification required</h3>
        <p className="text-sm text-soft leading-relaxed mb-4">
          To get bank offers, we need to check your eligibility first. This is a <strong className="text-foreground">soft check</strong> — it won't affect your credit score.
        </p>
        <div className="bg-terra/10 border border-terra/20 rounded-lg px-3.5 py-2.5 mb-5">
          <p className="text-xs text-terra leading-relaxed m-0">💡 Pre-qualifying takes less than 2 minutes and unlocks personalised bank offers for this vehicle.</p>
        </div>
        <button onClick={onPrequalify} className="w-full bg-terra text-primary-foreground border-none rounded-full py-3.5 text-sm font-bold cursor-pointer mb-2">
          Pre-qualify now →
        </button>
        <button onClick={onSkip} className="w-full py-3 bg-transparent border-none text-soft text-sm cursor-pointer">
          Cancel
        </button>
      </div>
    </div>
  );
}

export function VehicleSearch({ query, answers, na, prequalified, onNav }: VehicleSearchProps) {
  const [mode, setMode] = useState<"tinder" | "list">("tinder");
  const [cardIdx, setCardIdx] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("match");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalCar, setModalCar] = useState<typeof CARS[0] | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const [bankOfferCar, setBankOfferCar] = useState<typeof CARS[0] | null>(null);
  const [showPrequalGate, setShowPrequalGate] = useState(false);
  const [pendingBankCar, setPendingBankCar] = useState<typeof CARS[0] | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [showContractScan, setShowContractScan] = useState(false);
  const name = prequalified ? "Lerato" : "there";
  const isCash = answers?.paymenttype === "cash";

  const suggestions = [
    "Something reliable and safe under R5,450 per month",
    "Low mileage, not more than one owner, service plan still active",
    "A modern car with the latest technology",
  ];

  let sorted = [...CARS];
  if (sortBy === "instalment") sorted.sort((a, b) => parseInt(a.monthly) - parseInt(b.monthly));
  if (sortBy === "fuel") sorted.sort((a, b) => a.fuel - b.fuel);
  if (sortBy === "match") sorted.sort((a, b) => b.match - a.match);
  if (sortBy === "deal") sorted.sort((a, b) => parseInt(a.price.replace(/\D/g, "")) - parseInt(b.price.replace(/\D/g, "")));

  const cur = CARS[cardIdx];

  function openModal(type: ModalType, car: typeof CARS[0]) {
    setModalCar(car);
    setModalType(type);
  }

  function handleBankOffer(car: typeof CARS[0]) {
    if (!prequalified) {
      setPendingBankCar(car);
      setShowPrequalGate(true);
    } else {
      setBankOfferCar(car);
    }
  }

  function swipe(dir: string) {
    if (dir === "right") setLiked(l => [...l, cur.id]);
    if (cardIdx < CARS.length - 1) setCardIdx(i => i + 1);
    else setMode("list");
  }

  const journeyRows = [
    ["Needs", answers?.firsttime === "yes" ? "First car · Finance" : "Upgrade · Finance"],
    ["Budget", prequalified ? "R5,450/pm Pre-Qualified" : "Not yet checked"],
    ["Insurance", "Not checked yet ⚠"],
    ["Protection", "AI Contract Scan"],
  ];

  if (showContractScan) {
    return <ContractScan onNav={(screen) => {
      if (screen === "vehicleSearch") setShowContractScan(false);
      else onNav(screen);
    }} />;
  }

  if (bankOfferCar) {
    return <BankOffers car={bankOfferCar} onNav={onNav} onClose={() => setBankOfferCar(null)} />;
  }

  return (
    <div className="bg-background min-h-screen">
      {modalType === "fuel" && modalCar && <FuelModal car={modalCar} onClose={() => setModalType(null)} />}
      {modalType === "reduce" && modalCar && <ReducePriceModal car={modalCar} onClose={() => setModalType(null)} />}
      {modalType === "balloon" && modalCar && <BalloonModal car={modalCar} onClose={() => setModalType(null)} />}
      {modalType === "tradeIn" && <TradeInModal onClose={() => setModalType(null)} />}
      {showPrequalGate && (
        <PrequalGate
          onPrequalify={() => {
            setShowPrequalGate(false);
            onNav("prequal", { query, answers, na });
          }}
          onSkip={() => {
            setShowPrequalGate(false);
            setPendingBankCar(null);
          }}
        />
      )}
      <TopBar onBack={() => onNav("landing")} />

      <div className="px-5 pt-4 max-w-md mx-auto">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-3.5">
          Hi, <span className="text-terra">{name}</span> 👋
        </h2>

        {/* Journey summary */}
        <div className="bg-card border border-sand rounded-2xl px-4 py-3.5 mb-4">
          <p className="text-[10px] uppercase tracking-[1.5px] text-soft mb-2.5 font-semibold">Your journey so far</p>
          {journeyRows.map(([label, val]) => (
            <div key={label} className="flex gap-3 mb-1.5 items-start">
              <span className="text-xs text-soft min-w-[72px] shrink-0">{label}</span>
              <span className="text-xs text-foreground leading-relaxed font-medium">{val}</span>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-sand flex gap-2">
            <button className="flex-1 bg-terra text-primary-foreground border-none rounded-full py-2.5 text-xs font-semibold cursor-pointer">
              Get Insurance Quote
            </button>
            <button
              onClick={() => setShowContractScan(true)}
              className="flex-1 bg-card border border-terra text-terra rounded-full py-2.5 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FileCheck size={12} />
              AI Contract Scan
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-card border-[1.5px] border-sand rounded-2xl px-3.5 py-3 flex gap-2 mb-2.5 items-center">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Tell us what you're looking for" className="flex-1 border-none outline-none text-[13px] text-foreground bg-transparent font-body" />
        </div>
        <div className="flex flex-col gap-1 mb-4">
          {suggestions.map(s => (
            <button key={s} onClick={() => setSearchQ(s)} className="bg-transparent border-none text-left text-xs text-terra cursor-pointer p-0 py-0.5 font-body flex gap-1.5 items-center hover:underline">
              <span className="text-sand">→</span> {s}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-2 mb-4">
          {([["tinder", "Quick swipe"], ["list", "Browse list"]] as const).map(([val, label]) => (
            <button key={val} onClick={() => setMode(val)} className={`flex-1 py-2.5 rounded-full text-sm font-semibold cursor-pointer border-[1.5px] transition-colors ${
              mode === val ? "bg-foreground text-card border-foreground" : "bg-card text-soft border-sand"
            }`}>{label}</button>
          ))}
        </div>
      </div>

      {/* TINDER MODE */}
      {mode === "tinder" && cardIdx < CARS.length && (
        <div className="px-5 pb-6 max-w-md mx-auto">
          <p className="text-[11px] text-soft text-center mb-3">{cardIdx + 1} of {CARS.length} · tap to see more</p>
          <div className="bg-card border-[1.5px] border-sand rounded-2xl overflow-hidden mb-4">
            <div className="bg-gradient-to-br from-muted to-sand h-48 flex items-center justify-center relative text-7xl">
              🚗
              <div className="absolute top-3 left-3 bg-terra text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full">{cur.tag}</div>
              {cur.servicePlan && <div className="absolute top-3 right-3 bg-success text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full">Service plan ✓</div>}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground m-0 mb-0.5">{cur.year} {cur.make} {cur.model}</h3>
                  <p className="text-[13px] text-soft m-0">{cur.mileage} · {cur.transmission} · {cur.fuelType}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-terra m-0 mb-0.5">{isCash ? cur.price : cur.monthly}</p>
                  {!isCash && <p className="text-[11px] text-soft m-0">{cur.price} total</p>}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-1.5 mb-3.5 flex-wrap">
                <button onClick={() => openModal("fuel", cur)} className="bg-warning-bg border border-warning/30 rounded-lg px-2.5 py-2 text-[11px] text-warning font-semibold cursor-pointer font-body flex items-center gap-1">
                  <Fuel size={11} /> Fuel
                </button>
                <button onClick={() => openModal("reduce", cur)} className="bg-success-bg border border-success/30 rounded-lg px-2.5 py-2 text-[11px] text-success font-semibold cursor-pointer font-body flex items-center gap-1">
                  <Tag size={11} /> Reduce
                </button>
                <button onClick={() => openModal("balloon", cur)} className="bg-terra/10 border border-terra/30 rounded-lg px-2.5 py-2 text-[11px] text-terra font-semibold cursor-pointer font-body flex items-center gap-1">
                  <CircleDollarSign size={11} /> Balloon
                </button>
                <button onClick={() => openModal("tradeIn", cur)} className="bg-info-bg border border-info/30 rounded-lg px-2.5 py-2 text-[11px] text-info font-semibold cursor-pointer font-body flex items-center gap-1">
                  <ArrowLeftRight size={11} /> Trade-in
                </button>
              </div>

              {/* Swipe actions */}
              <div className="flex gap-2.5 mb-2">
                <button onClick={() => swipe("left")} className="flex-1 py-3 rounded-full bg-danger-bg text-danger border-[1.5px] border-danger/30 text-sm font-bold cursor-pointer">✕ Less like this</button>
                <button onClick={() => swipe("right")} className="flex-1 py-3 rounded-full bg-success-bg text-success border-[1.5px] border-success/30 text-sm font-bold cursor-pointer">✓ More like this</button>
              </div>

              {/* Get bank offer */}
              <button
                onClick={() => handleBankOffer(cur)}
                className="w-full py-3 rounded-full bg-terra text-primary-foreground border-none text-sm font-bold cursor-pointer hover:opacity-90 transition-opacity"
              >
                {isCash ? "Make offer" : "Get bank offer"}
              </button>
            </div>
          </div>
          <button onClick={() => setMode("list")} className="w-full bg-transparent border-none text-sm text-soft cursor-pointer hover:text-terra transition-colors">Skip to full list →</button>
        </div>
      )}

      {/* LIST MODE */}
      {mode === "list" && (
        <div className="px-5 pb-8 max-w-md mx-auto">
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3.5">
            {([["match", "Best match"], ["instalment", "Lowest instalment"], ["fuel", "Lowest fuel cost"], ["deal", "Best deal"]] as const).map(([val, label]) => (
              <button key={val} onClick={() => setSortBy(val)} className={`rounded-full px-3.5 py-2 text-[11px] font-semibold cursor-pointer whitespace-nowrap font-body border-[1.5px] transition-colors ${
                sortBy === val ? "bg-foreground text-card border-foreground" : "bg-card text-soft border-sand"
              }`}>{label}</button>
            ))}
          </div>

          {sorted.map(car => {
            const isExpanded = expandedCard === car.id;
            return (
              <div key={car.id} className="bg-card border-[1.5px] border-sand rounded-2xl overflow-hidden mb-2.5">
                {/* Large image area */}
                <div className="bg-gradient-to-br from-muted to-sand h-40 flex items-center justify-center text-6xl relative">
                  🚗
                  <div className="absolute top-3 left-3 bg-terra text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full">{car.tag}</div>
                  {car.servicePlan && <div className="absolute top-3 right-3 bg-success text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full">Service plan ✓</div>}
                  <span className="absolute bottom-2 right-2 bg-info-bg text-info text-[10px] font-semibold px-2 py-1 rounded-full">{car.match}% match</span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between mb-1">
                    <p className="text-[15px] font-bold text-foreground m-0">{car.year} {car.make} {car.model}</p>
                    <p className="text-[15px] font-bold text-terra m-0">{isCash ? car.price : car.monthly}</p>
                  </div>
                  <p className="text-xs text-soft m-0 mb-3">{car.mileage} · {car.transmission} · {car.fuelType}{!isCash ? ` · ${car.price}` : ""}</p>

                  {/* View more toggle */}
                  {isExpanded && (
                    <div className="flex gap-1.5 flex-wrap mb-3 animate-fade-in">
                      <button onClick={() => openModal("fuel", car)} className="bg-warning-bg border-none text-warning text-[10px] font-semibold px-2.5 py-1.5 rounded-full cursor-pointer flex items-center gap-1">
                        <Fuel size={10} /> Fuel cost
                      </button>
                      <button onClick={() => openModal("reduce", car)} className="bg-success-bg border-none text-success text-[10px] font-semibold px-2.5 py-1.5 rounded-full cursor-pointer flex items-center gap-1">
                        <Tag size={10} /> Reduce price
                      </button>
                      <button onClick={() => openModal("balloon", car)} className="bg-terra/10 border-none text-terra text-[10px] font-semibold px-2.5 py-1.5 rounded-full cursor-pointer flex items-center gap-1">
                        <CircleDollarSign size={10} /> Balloon
                      </button>
                      <button onClick={() => openModal("tradeIn", car)} className="bg-info-bg border-none text-info text-[10px] font-semibold px-2.5 py-1.5 rounded-full cursor-pointer flex items-center gap-1">
                        <ArrowLeftRight size={10} /> Trade-in
                      </button>
                      {liked.includes(car.id) && <span className="bg-success-bg text-success text-[10px] font-semibold px-2 py-1.5 rounded-full">Liked ✓</span>}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => setExpandedCard(isExpanded ? null : car.id)}
                      className="flex-1 py-2.5 rounded-full border-[1.5px] border-sand text-xs font-semibold cursor-pointer bg-card text-soft flex items-center justify-center gap-1"
                    >
                      {isExpanded ? <><ChevronUp size={12} /> Less</> : <><ChevronDown size={12} /> View more</>}
                    </button>
                    <button
                      onClick={() => handleBankOffer(car)}
                      className="flex-1 py-2.5 rounded-full border-none text-xs font-bold cursor-pointer bg-terra text-primary-foreground"
                    >
                      {isCash ? "Make offer" : "Get bank offer"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
