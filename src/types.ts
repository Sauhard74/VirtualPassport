export interface Country {
  name: {
    common: string;
    official: string;
  };
  capital: string[];
  flags: {
    png: string;
    svg: string;
  };
  latlng: number[];
  population: number;
  currencies: Record<string, { name: string; symbol: string }>;
  languages: Record<string, string>;
  region: string;
}

export interface SavedTrip {
  country: Country;
  visitDate: string;
  completed: string[];
  timeline?: TravelTimeline;
}

export interface CulturalFact {
  title: string;
  content: string;
}

export interface LanguageLesson {
  phrase: string;
  translation: string;
  pronunciation?: string;
}

export interface Challenge {
  title: string;
  description: string;
  type: 'cultural' | 'language' | 'exploration';
  completed: boolean;
}

export interface TravelDay {
  day: number;
  title: string;
  description: string;
  activities: TravelActivity[];
  location: string;
  mood: string;
  weatherForecast: string;
  tips: string[];
}

export interface TravelActivity {
  time: string;
  title: string;
  description: string;
  type: 'food' | 'sightseeing' | 'culture' | 'transport' | 'accommodation' | 'leisure';
  location?: string;
  cost?: string;
}

export interface TravelTimeline {
  duration: number;
  days: TravelDay[];
  totalCost: string;
  bestTimeToVisit: string;
  weatherSummary: string;
  packingTips: string[];
  localCustoms: string[];
}