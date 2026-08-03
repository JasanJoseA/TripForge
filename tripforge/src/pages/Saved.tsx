import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2, MapPin, Wallet, CalendarDays } from "lucide-react";
import { useTripStore } from "../store/useTripStore";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export default function Saved() {
  const { savedTrips, deleteSavedTrip } = useTripStore();

  if (savedTrips.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-5">
        <MapPin className="w-8 h-8 text-[var(--color-spruce-500)] mx-auto mb-3" />
        <h2 className="font-display text-2xl text-[var(--color-parchment-100)]">No trips saved yet</h2>
        <p className="text-sm text-[var(--color-spruce-400)] mt-2">Forge your first route and it'll show up here.</p>
        <Link to="/plan"><Button variant="primary" className="mt-5">Start planning</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <h1 className="font-display text-3xl text-[var(--color-parchment-100)] mb-8">Saved Trips</h1>
      <div className="grid md:grid-cols-2 gap-5">
        {savedTrips.map((trip, i) => (
          <motion.div key={trip.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="p-6">
              <div className="flex justify-between items-start gap-3">
                <h3 className="font-display text-lg text-[var(--color-parchment-100)]">{trip.itinerary.name}</h3>
                <button onClick={() => deleteSavedTrip(trip.id)} aria-label="Delete trip" className="text-[var(--color-spruce-400)] hover:text-[var(--color-clay-500)]">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-[var(--color-spruce-400)] mt-2">{trip.itinerary.summary}</p>
              <div className="flex gap-4 mt-4 font-mono text-xs text-[var(--color-parchment-300)]">
                <span className="flex items-center gap-1"><Wallet className="w-3.5 h-3.5 text-[var(--color-ember-400)]" />{trip.itinerary.estimatedTotalCost}</span>
                <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-[var(--color-ember-400)]" />{trip.itinerary.duration}</span>
              </div>
              {trip.review && (
                <p className="mt-3 text-xs font-mono text-[var(--color-fern-400)]">Guardian match: {trip.review.matchScore.toFixed(1)}/10</p>
              )}
              <p className="mt-3 text-[10px] font-mono text-[var(--color-spruce-500)]">Saved {new Date(trip.savedAt).toLocaleDateString()}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
