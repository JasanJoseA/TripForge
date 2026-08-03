import { motion } from "framer-motion";
import { Footprints, Users, Wallet, CalendarDays, Check, X } from "lucide-react";
import type { Itinerary } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { CurrencyConverter } from "./CurrencyConverter";

const LEVEL_COLOR: Record<string, string> = {
  Easy: "text-[var(--color-fern-400)]",
  Low: "text-[var(--color-fern-400)]",
  Moderate: "text-[var(--color-ember-400)]",
  Medium: "text-[var(--color-ember-400)]",
  Challenging: "text-[var(--color-clay-500)]",
  High: "text-[var(--color-clay-500)]",
};

export function ItineraryCard({ itinerary, onChoose, index }: { itinerary: Itinerary; onChoose: () => void; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.5 }}>
      <Card hover className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl text-[var(--color-parchment-100)] leading-snug">{itinerary.name}</h3>
          <span className="font-mono text-xs text-[var(--color-spruce-400)] shrink-0">{itinerary.duration}</span>
        </div>

        <p className="text-sm text-[var(--color-spruce-400)] mt-2 leading-relaxed">{itinerary.summary}</p>

        <div className="grid grid-cols-2 gap-3 mt-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-[var(--color-parchment-300)]"><Wallet className="w-3.5 h-3.5 text-[var(--color-ember-400)]" /> {itinerary.estimatedTotalCost}</div>
          <div className="flex items-center gap-1.5 text-[var(--color-parchment-300)]"><CalendarDays className="w-3.5 h-3.5 text-[var(--color-ember-400)]" /> {itinerary.estimatedDailyCost}</div>
          <div className={`flex items-center gap-1.5 ${LEVEL_COLOR[itinerary.difficulty]}`}><Footprints className="w-3.5 h-3.5" /> {itinerary.difficulty}</div>
          <div className={`flex items-center gap-1.5 ${LEVEL_COLOR[itinerary.crowdLevel]}`}><Users className="w-3.5 h-3.5" /> {itinerary.crowdLevel} crowds</div>
        </div>

        <div className="mt-2">
          <CurrencyConverter usdAmountLabel={itinerary.estimatedTotalCost} />
        </div>

        <div className="mt-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-spruce-400)] mb-1.5">Main stops</p>
          <ul className="text-sm text-[var(--color-parchment-200)] space-y-1">
            {itinerary.mainAttractions.map((a) => <li key={a} className="flex gap-1.5"><span className="text-[var(--color-fern-500)]">·</span>{a}</li>)}
          </ul>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fern-500)] mb-1 flex items-center gap-1"><Check className="w-3 h-3" /> Pros</p>
            <ul className="space-y-0.5 text-[var(--color-parchment-300)]">
              {itinerary.pros.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-clay-500)] mb-1 flex items-center gap-1"><X className="w-3 h-3" /> Cons</p>
            <ul className="space-y-0.5 text-[var(--color-parchment-300)]">
              {itinerary.cons.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
        </div>

        <p className="text-xs text-[var(--color-spruce-400)] mt-4 italic">{itinerary.whyItMatches}</p>

        <Button onClick={onChoose} variant="primary" className="mt-5 w-full">Choose this trip</Button>
      </Card>
    </motion.div>
  );
}
