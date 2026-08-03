import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, Backpack, Sparkles, Compass as CompassIcon, Gauge } from "lucide-react";
import type { GuardianReview, Itinerary } from "../../types";
import { Card } from "../ui/Card";
import { WeatherWidget } from "./WeatherWidget";
import { TripMap } from "./TripMap";

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4.5 h-4.5 text-[var(--color-ember-400)]" />
        <h3 className="font-display text-lg text-[var(--color-parchment-100)]">{title}</h3>
      </div>
      <div className="text-sm text-[var(--color-parchment-300)] leading-relaxed space-y-2">{children}</div>
    </Card>
  );
}

export function GuardianReport({ review, itinerary }: { review: GuardianReview; itinerary: Itinerary }) {
  const destination = itinerary.name.split(" — ")[0];
  return (
    <div className="max-w-3xl mx-auto space-y-5 print-area">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-[var(--color-fern-400)]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-spruce-400)]">Guardian's Match Score</span>
          </div>
          <div className="font-display text-6xl text-[var(--color-ember-400)]">{review.matchScore.toFixed(1)}<span className="text-2xl text-[var(--color-spruce-400)]">/10</span></div>
          <p className="text-sm text-[var(--color-parchment-300)] mt-3 max-w-lg mx-auto">{review.matchScoreReason}</p>
        </Card>
      </motion.div>

      <div className="no-print grid sm:grid-cols-2 gap-5">
        <WeatherWidget destination={destination} />
        <TripMap destination={destination} />
      </div>

      <Section icon={ShieldCheck} title="Safety">
        <p>{review.safety.localSafety}</p>
        <p><span className="text-[var(--color-parchment-100)]">Common scams: </span>{review.safety.commonScams.join("; ")}.</p>
        <p><span className="text-[var(--color-parchment-100)]">Areas to be mindful of: </span>{review.safety.dangerousAreas}</p>
        <p><span className="text-[var(--color-parchment-100)]">Emergency numbers: </span>{review.safety.emergencyNumbers}</p>
        <p><span className="text-[var(--color-parchment-100)]">Weather: </span>{review.safety.weatherConcerns}</p>
        <p><span className="text-[var(--color-parchment-100)]">Health: </span>{review.safety.healthAdvice}</p>
        <p><span className="text-[var(--color-parchment-100)]">Transport: </span>{review.safety.transportSafety}</p>
      </Section>

      <Section icon={CompassIcon} title="Planning Tips">
        <p><span className="text-[var(--color-parchment-100)]">Booking: </span>{review.planningTips.bookingAdvice}</p>
        <p><span className="text-[var(--color-parchment-100)]">Best times: </span>{review.planningTips.bestTimes}</p>
        <p><span className="text-[var(--color-parchment-100)]">Customs: </span>{review.planningTips.localCustoms}</p>
        <p><span className="text-[var(--color-parchment-100)]">Etiquette: </span>{review.planningTips.culturalEtiquette}</p>
        <p><span className="text-[var(--color-parchment-100)]">Budget: </span>{review.planningTips.budgetAdvice}</p>
        <p><span className="text-[var(--color-parchment-100)]">Transportation: </span>{review.planningTips.transportationTips}</p>
      </Section>

      <Section icon={Backpack} title="Packing Checklist">
        <ul className="grid sm:grid-cols-2 gap-1.5">
          {review.packingChecklist.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-sm border border-[var(--color-fern-500)]/60 shrink-0" /> {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={Sparkles} title="Fun Recommendations">
        <p><span className="text-[var(--color-parchment-100)]">Restaurants: </span>{review.funRecommendations.restaurants.join("; ")}</p>
        <p><span className="text-[var(--color-parchment-100)]">Cafes: </span>{review.funRecommendations.cafes.join("; ")}</p>
        <p><span className="text-[var(--color-parchment-100)]">Viewpoints: </span>{review.funRecommendations.viewpoints.join("; ")}</p>
        <p><span className="text-[var(--color-parchment-100)]">Local experiences: </span>{review.funRecommendations.localExperiences.join("; ")}</p>
        <p><span className="text-[var(--color-parchment-100)]">Nightlife: </span>{review.funRecommendations.nightlife.join("; ")}</p>
        <p><span className="text-[var(--color-parchment-100)]">Photo spots: </span>{review.funRecommendations.photographySpots.join("; ")}</p>
      </Section>

      <Section icon={AlertTriangle} title="Possible Risks">
        <ul className="space-y-1">
          {review.possibleRisks.map((r) => <li key={r} className="flex gap-2"><span className="text-[var(--color-clay-500)]">!</span>{r}</li>)}
        </ul>
      </Section>

      <Section icon={Gauge} title="Final Verdict">
        <p className="text-[var(--color-parchment-100)]">{review.finalVerdict}</p>
      </Section>

      <p className="text-center font-mono text-xs text-[var(--color-spruce-400)]">Reviewed route: {itinerary.name}</p>
    </div>
  );
}
