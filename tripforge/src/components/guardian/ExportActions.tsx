import { useState } from "react";
import { Printer, CalendarPlus, Share2, Check } from "lucide-react";
import type { Itinerary, TravelProfile } from "../../types";
import { exportItineraryToICS, shareOrCopyTrip } from "../../lib/export";
import { Button } from "../ui/Button";

export function ExportActions({ itinerary, profile }: { itinerary: Itinerary; profile: TravelProfile }) {
  const [shareState, setShareState] = useState<"idle" | "done">("idle");

  async function handleShare() {
    const result = await shareOrCopyTrip(itinerary);
    if (result !== "failed") {
      setShareState("done");
      setTimeout(() => setShareState("idle"), 2000);
    }
  }

  return (
    <div className="no-print flex flex-wrap justify-center gap-2">
      <Button variant="secondary" onClick={() => window.print()}>
        <Printer className="w-4 h-4" /> Export as PDF
      </Button>
      <Button variant="secondary" onClick={() => exportItineraryToICS(itinerary, profile)}>
        <CalendarPlus className="w-4 h-4" /> Add to calendar
      </Button>
      <Button variant="secondary" onClick={handleShare}>
        {shareState === "done" ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        {shareState === "done" ? "Copied" : "Share trip"}
      </Button>
    </div>
  );
}
