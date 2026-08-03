import type { TravelProfile, Itinerary, GuardianReview, Rating, AgentName } from "../types";

/* ---------------------------------------------------------------------- */
/*  SCOUT — guided question flow that builds a TravelProfile              */
/* ---------------------------------------------------------------------- */

export interface ScoutQuestion {
  key: keyof TravelProfile;
  prompt: string;
  placeholder: string;
  multiline?: boolean;
}

export const SCOUT_QUESTIONS: ScoutQuestion[] = [
  { key: "destination", prompt: "Where's calling you? A country, a region, or just a vibe — I'll help narrow it down.", placeholder: "e.g. Japan, or 'somewhere coastal and quiet'" },
  { key: "dates", prompt: "When are you thinking of setting out?", placeholder: "e.g. mid-October, or flexible" },
  { key: "tripLength", prompt: "How many days do you have to work with?", placeholder: "e.g. 7 days" },
  { key: "travelers", prompt: "How many people are on this trip?", placeholder: "e.g. 2" },
  { key: "budget", prompt: "What's your total budget, roughly?", placeholder: "e.g. $2,500 per person" },
  { key: "travelStyle", prompt: "What's your pace — slow and immersive, or pack-it-in adventurous?", placeholder: "e.g. relaxed with a few big days" },
  { key: "interests", prompt: "What pulls you in? Hiking, food, history, nightlife, wildlife...", placeholder: "e.g. hiking, local food, hidden viewpoints" },
  { key: "accommodationPreferences", prompt: "Where do you like to sleep — boutique hotels, hostels, cabins, something else?", placeholder: "e.g. small local guesthouses" },
  { key: "foodPreferences", prompt: "Any food preferences or restrictions I should plan around?", placeholder: "e.g. vegetarian, love street food" },
  { key: "transportationPreferences", prompt: "How do you like to get around — rental car, trains, guided transport?", placeholder: "e.g. mostly trains and walking" },
  { key: "accessibilityNeeds", prompt: "Any accessibility needs I should account for?", placeholder: "e.g. none, or limited mobility" },
  { key: "specialRequests", prompt: "Anything else on your mind — a celebration, a must-see spot, something to avoid?", placeholder: "e.g. it's our anniversary", multiline: true },
];

export const emptyProfile: TravelProfile = {
  destination: "", budget: "", dates: "", tripLength: "", travelers: 2,
  travelStyle: "", interests: [], accessibilityNeeds: "", foodPreferences: "",
  accommodationPreferences: "", transportationPreferences: "", specialRequests: "",
};

/* ---------------------------------------------------------------------- */
/*  EXPLORER — generates five itinerary concepts from a profile           */
/* ---------------------------------------------------------------------- */

const ARCHETYPES = [
  { suffix: "Trail & Summit Route", difficulty: "Challenging" as const, walking: "High" as const, crowd: "Low" as const, angle: "for travelers who want the landscape to do the talking" },
  { suffix: "Culture & Cuisine Circuit", difficulty: "Easy" as const, walking: "Medium" as const, crowd: "Medium" as const, angle: "built around markets, kitchens, and old neighborhoods" },
  { suffix: "Slow Coastal Wander", difficulty: "Easy" as const, walking: "Low" as const, crowd: "Low" as const, angle: "unhurried, with room to just sit and watch the water" },
  { suffix: "Off-Grid Explorer", difficulty: "Challenging" as const, walking: "High" as const, crowd: "Low" as const, angle: "for the parts of the map most people skip" },
  { suffix: "Classic Highlights, Local Pace", difficulty: "Moderate" as const, walking: "Medium" as const, crowd: "High" as const, angle: "the essentials, without the tour-bus rush" },
];

function costFromBudget(budget: string, travelers: number, share: number) {
  const num = parseInt(budget.replace(/[^0-9]/g, ""), 10);
  const base = Number.isFinite(num) && num > 0 ? num : 2000 * Math.max(travelers, 1);
  const total = Math.round(base * share);
  return total;
}

export function generateItineraries(profile: TravelProfile): Itinerary[] {
  const dest = profile.destination.trim() || "your destination";
  const days = parseInt(profile.tripLength.replace(/[^0-9]/g, ""), 10) || 7;
  const interests = profile.interests.length ? profile.interests : ["local culture", "nature", "food"];

  return ARCHETYPES.map((a, i) => {
    const shareMultiplier = [1.15, 0.95, 0.85, 1.3, 1.0][i];
    const total = costFromBudget(profile.budget, profile.travelers || 1, shareMultiplier);
    const daily = Math.round(total / days);
    return {
      id: `itin-${i + 1}`,
      name: `${dest} — ${a.suffix}`,
      estimatedTotalCost: `$${total.toLocaleString()}`,
      estimatedDailyCost: `$${daily.toLocaleString()}/day`,
      duration: `${days} days`,
      summary: `A ${days}-day route through ${dest}, ${a.angle}, shaped around ${interests.slice(0, 2).join(" and ")}.`,
      mainAttractions: [
        `${dest} old town / central district`,
        `Signature viewpoint outside ${dest}`,
        `Regional day-trip highlight`,
      ],
      activities: interests.slice(0, 4).map((int) => `${int[0].toUpperCase()}${int.slice(1)} experiences woven through the itinerary`),
      difficulty: a.difficulty,
      walkingLevel: a.walking,
      crowdLevel: a.crowd,
      bestSeason: profile.dates || "Shoulder season (spring or early autumn)",
      transportation: profile.transportationPreferences || "Mix of walking, local transit, and occasional taxis",
      pros: [
        "Matches your stated pace and interests",
        "Balanced mix of planned and open time",
        "Fits within your budget range",
      ],
      cons: [
        i % 2 === 0 ? "Some early starts to beat crowds" : "A couple of longer transit days",
        "Popular stops may need advance booking",
      ],
      whyItMatches: `Leans into ${interests[0] || "your interests"} and your ${profile.travelStyle || "preferred"} pace, at a ${a.difficulty.toLowerCase()} activity level.`,
    };
  });
}

/* ---------------------------------------------------------------------- */
/*  GUARDIAN — produces the safety / planning / packing review            */
/* ---------------------------------------------------------------------- */

export function generateGuardianReview(itinerary: Itinerary, profile: TravelProfile): GuardianReview {
  const score = Math.round((8.4 + Math.random() * 1.4) * 10) / 10;
  return {
    matchScore: Math.min(score, 9.9),
    matchScoreReason: `This route lines up closely with what you told Scout: a ${profile.travelStyle || "balanced"} pace, ${itinerary.difficulty.toLowerCase()} activity level, and a focus on ${profile.interests[0] || "your top interest"}. The main deduction is booking flexibility around peak dates.`,
    safety: {
      localSafety: `${itinerary.name.split(" — ")[0]} is generally safe for visitors who take normal city precautions — stay aware in crowded transit hubs and keep valuables secured.`,
      commonScams: ["Overpriced 'friendly guide' offers near major sights", "Taxi meters not switched on — agree a fare first", "Fake ticket sellers outside popular attractions"],
      dangerousAreas: "No no-go areas expected on this route; ask your accommodation for current local guidance on arrival.",
      emergencyNumbers: "Save local emergency services and your embassy's contact number before you fly.",
      weatherConcerns: `Check the forecast close to ${itinerary.bestSeason} — pack for variability.`,
      healthAdvice: "Travel insurance recommended; check if any routine vaccinations are advised for the region.",
      transportSafety: "Use licensed transport operators and keep a photo of your accommodation address in the local language.",
    },
    planningTips: {
      bookingAdvice: "Book headline attractions and any multi-day trekking permits 4-6 weeks out.",
      bestTimes: `Aim for ${itinerary.bestSeason} for the best balance of weather and crowds.`,
      localCustoms: "A little local-language greeting goes a long way — locals notice the effort.",
      culturalEtiquette: "Dress modestly for religious sites; ask before photographing people.",
      budgetAdvice: `Your ${itinerary.estimatedDailyCost} estimate has some room — keep 10-15% aside for spontaneous finds.`,
      transportationTips: `${itinerary.transportation}. Consider a regional transit pass if staying multiple days in one hub.`,
    },
    packingChecklist: [
      "Comfortable, broken-in walking shoes",
      "Layered clothing for temperature swings",
      itinerary.walkingLevel === "High" ? "Daypack with hydration bladder" : "Lightweight day bag",
      "Universal power adapter",
      "Copy of travel insurance and key documents",
      "Reusable water bottle",
      "Basic first-aid kit",
    ],
    funRecommendations: {
      restaurants: ["A family-run spot away from the main square — ask your host for the current favorite"],
      cafes: ["Early-morning cafe near the old quarter, best before the tour groups arrive"],
      viewpoints: ["Sunset viewpoint just outside the main attractions, a short walk from the center"],
      localExperiences: ["A local-led walking tour, usually cheaper and more candid than big-brand tours"],
      nightlife: ["Low-key bar district a few streets back from the tourist strip"],
      photographySpots: ["Golden-hour shot from the elevated old-town wall or bridge"],
    },
    possibleRisks: [
      "Peak-season crowds at headline sights — early starts help",
      itinerary.difficulty === "Challenging" ? "Some sections are physically demanding — pace yourself and hydrate" : "Occasional weather-related schedule shifts",
      "Standard tourist-area scams — confidence, not fear, is the best defense",
    ],
    finalVerdict: `A strong match for what you're after. This route delivers on ${profile.interests.slice(0, 2).join(" and ") || "your stated interests"} while staying realistic about pace and budget — go in with a loose plan and a bit of flexibility.`,
  };
}

/* ---------------------------------------------------------------------- */
/*  LEARNING SYSTEM — summarize approved feedback into guidance           */
/* ---------------------------------------------------------------------- */

const BANNED_PATTERNS = [/ignore (all|previous)/i, /system prompt/i, /you are now/i, /disregard/i, /act as/i];

export function isFeedbackSafe(comment: string): boolean {
  if (!comment.trim()) return true;
  return !BANNED_PATTERNS.some((p) => p.test(comment));
}

export function summarizeApprovedFeedback(ratings: Rating[], agent: AgentName): string[] {
  const relevant = ratings.filter((r) => r.agent === agent && r.approved && r.comment.trim());
  if (relevant.length === 0) return [];
  // Lightweight local summarizer: dedupe + trim to short guidance bullets.
  const seen = new Set<string>();
  const bullets: string[] = [];
  for (const r of relevant.slice(-8)) {
    const cleaned = r.comment.trim().replace(/\s+/g, " ");
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    bullets.push(cleaned.length > 90 ? cleaned.slice(0, 87) + "..." : cleaned);
  }
  return bullets;
}
