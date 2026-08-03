import { useEffect, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { geocodeDestination } from "../../lib/geo";
import { Card } from "../ui/Card";

export function TripMap({ destination }: { destination: string }) {
  const [state, setState] = useState<"loading" | "ready" | "unavailable">("loading");
  const [src, setSrc] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState("loading");
      const geo = await geocodeDestination(destination);
      if (!geo || cancelled) { if (!cancelled) setState("unavailable"); return; }
      const d = 0.35; // rough bounding box padding in degrees
      const bbox = `${geo.longitude - d},${geo.latitude - d},${geo.longitude + d},${geo.latitude + d}`;
      setSrc(`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${geo.latitude},${geo.longitude}`);
      setLabel(`${geo.name}${geo.country ? ", " + geo.country : ""}`);
      setState("ready");
    })();
    return () => { cancelled = true; };
  }, [destination]);

  if (state === "unavailable") return null;

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4.5 h-4.5 text-[var(--color-ember-400)]" />
        <h3 className="font-display text-lg text-[var(--color-parchment-100)]">Route area</h3>
        {label && <span className="font-mono text-xs text-[var(--color-spruce-400)]">— {label}</span>}
      </div>
      {state === "loading" ? (
        <div className="h-64 flex items-center justify-center text-sm text-[var(--color-spruce-400)] gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Locating {destination}...
        </div>
      ) : (
        <iframe
          title="Trip map"
          src={src}
          className="w-full h-64 rounded-xl border border-[var(--color-spruce-500)]/30"
          loading="lazy"
        />
      )}
      <p className="text-[10px] font-mono text-[var(--color-spruce-500)] mt-2">Map data © OpenStreetMap contributors</p>
    </Card>
  );
}
