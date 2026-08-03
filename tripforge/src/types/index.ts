export interface TravelProfile {
  destination: string;
  budget: string;
  dates: string;
  tripLength: string;
  travelers: number;
  travelStyle: string;
  interests: string[];
  accessibilityNeeds: string;
  foodPreferences: string;
  accommodationPreferences: string;
  transportationPreferences: string;
  specialRequests: string;
}

export interface ChatMessage {
  id: string;
  role: "agent" | "user";
  content: string;
  timestamp: number;
}

export interface Itinerary {
  id: string;
  name: string;
  estimatedTotalCost: string;
  estimatedDailyCost: string;
  duration: string;
  summary: string;
  mainAttractions: string[];
  activities: string[];
  difficulty: "Easy" | "Moderate" | "Challenging";
  walkingLevel: "Low" | "Medium" | "High";
  crowdLevel: "Low" | "Medium" | "High";
  bestSeason: string;
  transportation: string;
  pros: string[];
  cons: string[];
  whyItMatches: string;
}

export interface GuardianReview {
  matchScore: number;
  matchScoreReason: string;
  safety: {
    localSafety: string;
    commonScams: string[];
    dangerousAreas: string;
    emergencyNumbers: string;
    weatherConcerns: string;
    healthAdvice: string;
    transportSafety: string;
  };
  planningTips: {
    bookingAdvice: string;
    bestTimes: string;
    localCustoms: string;
    culturalEtiquette: string;
    budgetAdvice: string;
    transportationTips: string;
  };
  packingChecklist: string[];
  funRecommendations: {
    restaurants: string[];
    cafes: string[];
    viewpoints: string[];
    localExperiences: string[];
    nightlife: string[];
    photographySpots: string[];
  };
  possibleRisks: string[];
  finalVerdict: string;
}

export type AgentName = "scout" | "explorer" | "guardian";

export interface Rating {
  id: string;
  agent: AgentName;
  stars: number;
  comment: string;
  timestamp: number;
  approved: boolean;
}

export interface SavedTrip {
  id: string;
  profile: TravelProfile;
  itinerary: Itinerary;
  review: GuardianReview | null;
  savedAt: number;
}

export type Stage =
  | "landing"
  | "scout"
  | "explorer"
  | "guardian"
  | "summary";
