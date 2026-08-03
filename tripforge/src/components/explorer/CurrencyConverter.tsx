import { useState } from "react";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { fetchExchangeRate, parseUsdAmount } from "../../lib/currency";

const CURRENCIES = ["EUR", "GBP", "JPY", "CAD", "AUD", "CNY", "INR", "MXN"];

export function CurrencyConverter({ usdAmountLabel }: { usdAmountLabel: string }) {
  const [target, setTarget] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ready" | "unavailable">("idle");
  const [converted, setConverted] = useState<string>("");

  async function handleSelect(currency: string) {
    setTarget(currency);
    if (!currency) { setState("idle"); return; }
    const usd = parseUsdAmount(usdAmountLabel);
    if (usd == null) { setState("unavailable"); return; }
    setState("loading");
    const rate = await fetchExchangeRate("USD", currency);
    if (rate == null) { setState("unavailable"); return; }
    setConverted((usd * rate).toLocaleString(undefined, { maximumFractionDigits: 0 }));
    setState("ready");
  }

  return (
    <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-spruce-400)]">
      <ArrowLeftRight className="w-3 h-3" />
      <select
        value={target}
        onChange={(e) => handleSelect(e.target.value)}
        className="bg-transparent border border-[var(--color-spruce-500)]/40 rounded px-1 py-0.5 text-[var(--color-parchment-300)] outline-none"
        aria-label="Convert to currency"
      >
        <option value="">Convert...</option>
        {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      {state === "loading" && <Loader2 className="w-3 h-3 animate-spin" />}
      {state === "ready" && <span className="text-[var(--color-fern-400)]">≈ {converted} {target}</span>}
      {state === "unavailable" && <span className="text-[var(--color-clay-500)]">unavailable</span>}
    </div>
  );
}
