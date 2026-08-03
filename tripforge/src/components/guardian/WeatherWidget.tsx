import { useEffect, useState } from "react";
import { CloudSun, Loader2 } from "lucide-react";
import { geocodeDestination, fetchCurrentWeather, describeWeatherCode } from "../../lib/geo";
import { Card } from "../ui/Card";

export function WeatherWidget({ destination }: { destination: string }) {
  const [state, setState] = useState<"loading" | "ready" | "unavailable">("loading");
  const [data, setData] = useState<{ place: string; tempC: number; windKph: number; desc: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState("loading");
      const geo = await geocodeDestination(destination);
      if (!geo || cancelled) { if (!cancelled) setState("unavailable"); return; }
      const weather = await fetchCurrentWeather(geo.latitude, geo.longitude);
      if (!weather || cancelled) { if (!cancelled) setState("unavailable"); return; }
      setData({
        place: `${geo.name}${geo.country ? ", " + geo.country : ""}`,
        tempC: Math.round(weather.temperatureC),
        windKph: Math.round(weather.windKph),
        desc: describeWeatherCode(weather.weatherCode),
      });
      setState("ready");
    })();
    return () => { cancelled = true; };
  }, [destination]);

  if (state === "unavailable") return null;

  return (
    <Card className="p-5 flex items-center gap-4">
      <CloudSun className="w-8 h-8 text-[var(--color-ember-400)] shrink-0" />
      {state === "loading" ? (
        <div className="flex items-center gap-2 text-sm text-[var(--color-spruce-400)]">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking conditions in {destination}...
        </div>
      ) : data ? (
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-spruce-400)]">Right now in {data.place}</p>
          <p className="text-[var(--color-parchment-100)] mt-0.5">
            <span className="font-display text-2xl">{data.tempC}°C</span>
            <span className="text-sm text-[var(--color-spruce-400)] ml-2">{data.desc} · wind {data.windKph} km/h</span>
          </p>
        </div>
      ) : null}
    </Card>
  );
}
