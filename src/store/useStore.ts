import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Country, SavedTrip, Challenge } from '../types';

interface TravelStore {
  currentCountry: Country | null;
  savedTrips: SavedTrip[];
  challenges: Challenge[];
  setCurrentCountry: (country: Country) => void;
  addSavedTrip: (trip: SavedTrip) => void;
  completeChallenge: (challengeId: string) => void;
  teleportToNewCity: () => void;
}

export const useStore = create<TravelStore>()(
  persist(
    (set) => ({
      currentCountry: null,
      savedTrips: [],
      challenges: [],
      setCurrentCountry: (country) => set({ currentCountry: country }),
      addSavedTrip: (trip) =>
        set((state) => ({
          savedTrips: [...state.savedTrips, trip],
        })),
      completeChallenge: (challengeId) =>
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c.title === challengeId ? { ...c, completed: true } : c
          ),
        })),
      teleportToNewCity: () => {
        // Will be implemented when we have the Google Maps API key
      },
    }),
    {
      name: 'travel-store',
    }
  )
);