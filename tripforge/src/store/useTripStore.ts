import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  TravelProfile, ChatMessage, Itinerary, GuardianReview, Rating, SavedTrip, Stage,
} from "../types";
import { emptyProfile, isFeedbackSafe } from "../lib/mockAgents";

interface TripState {
  stage: Stage;
  profile: TravelProfile;
  messages: ChatMessage[];
  itineraries: Itinerary[];
  selectedItinerary: Itinerary | null;
  review: GuardianReview | null;
  savedTrips: SavedTrip[];
  ratings: Rating[];

  setStage: (s: Stage) => void;
  updateProfile: (patch: Partial<TravelProfile>) => void;
  addMessage: (m: ChatMessage) => void;
  setItineraries: (i: Itinerary[]) => void;
  selectItinerary: (i: Itinerary) => void;
  setReview: (r: GuardianReview) => void;
  saveCurrentTrip: () => void;
  deleteSavedTrip: (id: string) => void;
  addRating: (r: Omit<Rating, "id" | "timestamp" | "approved">) => void;
  resetFlow: () => void;
}

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      stage: "landing",
      profile: emptyProfile,
      messages: [],
      itineraries: [],
      selectedItinerary: null,
      review: null,
      savedTrips: [],
      ratings: [],

      setStage: (s) => set({ stage: s }),
      updateProfile: (patch) => set((st) => ({ profile: { ...st.profile, ...patch } })),
      addMessage: (m) => set((st) => ({ messages: [...st.messages, m] })),
      setItineraries: (i) => set({ itineraries: i }),
      selectItinerary: (i) => set({ selectedItinerary: i }),
      setReview: (r) => set({ review: r }),

      saveCurrentTrip: () => {
        const { profile, selectedItinerary, review, savedTrips } = get();
        if (!selectedItinerary) return;
        const trip: SavedTrip = {
          id: `trip-${Date.now()}`,
          profile,
          itinerary: selectedItinerary,
          review,
          savedAt: Date.now(),
        };
        set({ savedTrips: [trip, ...savedTrips] });
      },

      deleteSavedTrip: (id) => set((st) => ({ savedTrips: st.savedTrips.filter((t) => t.id !== id) })),

      addRating: (r) => {
        // Simple auto-moderation: appropriate + safe + no injection attempts.
        const approved = r.comment.trim().length < 500 && isFeedbackSafe(r.comment);
        const rating: Rating = {
          ...r,
          id: `rating-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          timestamp: Date.now(),
          approved,
        };
        set((st) => ({ ratings: [...st.ratings, rating] }));
      },

      resetFlow: () => set({
        stage: "landing", profile: emptyProfile, messages: [], itineraries: [],
        selectedItinerary: null, review: null,
      }),
    }),
    {
      name: "tripforge-storage",
      partialize: (st) => ({ savedTrips: st.savedTrips, ratings: st.ratings }),
    }
  )
);
