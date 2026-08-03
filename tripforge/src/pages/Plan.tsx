import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader2, MapPinned, RotateCcw } from "lucide-react";
import { useTripStore } from "../store/useTripStore";
import { generateItineraries, generateGuardianReview } from "../lib/mockAgents";
import { TrailProgress } from "../components/layout/TrailProgress";
import { ScoutChat } from "../components/scout/ScoutChat";
import { ItineraryCard } from "../components/explorer/ItineraryCard";
import { GuardianReport } from "../components/guardian/GuardianReport";
import { ExportActions } from "../components/guardian/ExportActions";
import { AgentRating } from "../components/ui/AgentRating";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function Plan() {
  const nav = useNavigate();
  const {
    stage, setStage, profile, itineraries, setItineraries,
    selectedItinerary, selectItinerary, review, setReview,
    saveCurrentTrip, resetFlow,
  } = useTripStore();
  const [loadingExplorer, setLoadingExplorer] = useState(false);
  const [loadingGuardian, setLoadingGuardian] = useState(false);

  useEffect(() => {
    if (stage === "landing") setStage("scout");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onScoutComplete() {
    setLoadingExplorer(true);
    setStage("explorer");
    setTimeout(() => {
      setItineraries(generateItineraries(profile));
      setLoadingExplorer(false);
    }, 1400);
  }

  function onChooseItinerary(i: (typeof itineraries)[number]) {
    selectItinerary(i);
    setStage("guardian");
    setLoadingGuardian(true);
    setTimeout(() => {
      setReview(generateGuardianReview(i, profile));
      setLoadingGuardian(false);
    }, 1400);
  }

  function onContinueToSummary() {
    saveCurrentTrip();
    setStage("summary");
  }

  return (
    <div className="max-w-6xl mx-auto px-5 pb-24">
      <TrailProgress current={stage === "landing" ? "scout" : stage} />

      {stage !== "summary" && stage !== "landing" && (
        <div className="text-right -mt-2 mb-4">
          <button onClick={() => { resetFlow(); }} className="text-xs font-mono text-[var(--color-spruce-400)] hover:text-[var(--color-ember-400)] inline-flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Start over
          </button>
        </div>
      )}

      {(stage === "landing" || stage === "scout") && (
        <ScoutChat onComplete={onScoutComplete} />
      )}

      {stage === "explorer" && (
        <div>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-1">
              <MapPinned className="w-5 h-5 text-[var(--color-ember-400)]" />
              <h2 className="font-display text-2xl text-[var(--color-parchment-100)]">Explorer found five routes</h2>
            </div>
            <p className="text-sm text-[var(--color-spruce-400)]">Built from your profile — pick the one that feels right.</p>
          </div>

          {loadingExplorer ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--color-ember-400)]" />
              <p className="font-mono text-xs text-[var(--color-spruce-400)]">Charting routes...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {itineraries.map((it, idx) => (
                <ItineraryCard key={it.id} itinerary={it} index={idx} onChoose={() => onChooseItinerary(it)} />
              ))}
            </div>
          )}
        </div>
      )}

      {stage === "guardian" && (
        loadingGuardian || !review || !selectedItinerary ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--color-ember-400)]" />
            <p className="font-mono text-xs text-[var(--color-spruce-400)]">Guardian is checking the route...</p>
          </div>
        ) : (
          <div>
            <GuardianReport review={review} itinerary={selectedItinerary} />
            <div className="max-w-3xl mx-auto mt-6 flex flex-col items-center gap-4">
              <ExportActions itinerary={selectedItinerary} profile={profile} />
              <Button variant="primary" onClick={onContinueToSummary}>Save trip &amp; continue</Button>
            </div>
          </div>
        )
      )}

      {stage === "summary" && selectedItinerary && review && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto text-center space-y-6">
          <Card className="p-8">
            <h2 className="font-display text-3xl text-[var(--color-parchment-100)]">Trip forged.</h2>
            <p className="text-[var(--color-spruce-400)] mt-2">{selectedItinerary.name} — saved to your trips.</p>
            <div className="flex justify-center gap-3 mt-6">
              <Button variant="secondary" onClick={() => nav("/saved")}>View saved trips</Button>
              <Button variant="primary" onClick={() => { resetFlow(); }}>Plan another trip</Button>
            </div>
          </Card>

          <div className="text-left space-y-4">
            <h3 className="font-display text-xl text-[var(--color-parchment-100)] text-center">Rate your trail guides</h3>
            <AgentRating agent="scout" />
            <AgentRating agent="explorer" />
            <AgentRating agent="guardian" />
          </div>
        </motion.div>
      )}
    </div>
  );
}
