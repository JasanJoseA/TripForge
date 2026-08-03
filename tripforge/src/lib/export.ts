import type { Itinerary, TravelProfile } from "../types";

/** Builds a downloadable .ics calendar file for the trip's date range. */
export function exportItineraryToICS(itinerary: Itinerary, profile: TravelProfile) {
  const days = parseInt(itinerary.duration.replace(/[^0-9]/g, ""), 10) || 7;

  // Best-effort start date: use profile.dates if it parses, else default to
  // 30 days from now so the file is still useful without a firm date yet.
  let start = new Date(profile.dates);
  if (isNaN(start.getTime())) {
    start = new Date();
    start.setDate(start.getDate() + 30);
  }
  const end = new Date(start);
  end.setDate(end.getDate() + days);

  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TripForge//Trip Export//EN",
    "BEGIN:VEVENT",
    `UID:${itinerary.id}@tripforge`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART;VALUE=DATE:${fmt(start).slice(0, 8)}`,
    `DTEND;VALUE=DATE:${fmt(end).slice(0, 8)}`,
    `SUMMARY:${itinerary.name}`,
    `DESCRIPTION:${itinerary.summary.replace(/\n/g, "\\n")} Estimated cost: ${itinerary.estimatedTotalCost}.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${itinerary.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Plain-text trip summary used for both clipboard copy and Web Share. */
export function buildTripSummaryText(itinerary: Itinerary): string {
  return [
    `${itinerary.name} — via TripForge`,
    `${itinerary.duration} · ${itinerary.estimatedTotalCost} (${itinerary.estimatedDailyCost})`,
    "",
    itinerary.summary,
    "",
    "Main stops: " + itinerary.mainAttractions.join(", "),
  ].join("\n");
}

export async function shareOrCopyTrip(itinerary: Itinerary): Promise<"shared" | "copied" | "failed"> {
  const text = buildTripSummaryText(itinerary);
  if (navigator.share) {
    try {
      await navigator.share({ title: itinerary.name, text });
      return "shared";
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}
