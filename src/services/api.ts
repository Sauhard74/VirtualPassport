import axios from 'axios';
import type { Country, CulturalFact, LanguageLesson, TravelTimeline } from '../types';

const COUNTRIES_API = 'https://restcountries.com/v3.1';
const UNSPLASH_API = 'https://api.unsplash.com';
const LIBRE_TRANSLATE_API = 'https://libretranslate.com';

export async function getRandomCountry(): Promise<Country> {
  const { data } = await axios.get(`${COUNTRIES_API}/all`);
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
}

export async function getCountryImages(countryName: string) {
  // Static travel images that are guaranteed to work
  const defaultImages = [
    {
      id: 1,
      urls: {
        small: 'https://images.unsplash.com/photo-1500835556837-99ac94a94552',
        regular: 'https://images.unsplash.com/photo-1500835556837-99ac94a94552'
      },
      alt_description: 'Mountain landscape with clouds'
    },
    {
      id: 2,
      urls: {
        small: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
        regular: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1'
      },
      alt_description: 'Cityscape during sunset'
    },
    {
      id: 3,
      urls: {
        small: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
        regular: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'
      },
      alt_description: 'Historic architecture'
    },
    {
      id: 4,
      urls: {
        small: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c',
        regular: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c'
      },
      alt_description: 'Beach sunset view'
    },
    {
      id: 5,
      urls: {
        small: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e',
        regular: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e'
      },
      alt_description: 'Rural landscape'
    },
    {
      id: 6,
      urls: {
        small: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220',
        regular: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220'
      },
      alt_description: 'Cultural festival'
    },
    {
      id: 7,
      urls: {
        small: 'https://images.unsplash.com/photo-1488747279002-c8523379faaa',
        regular: 'https://images.unsplash.com/photo-1488747279002-c8523379faaa'
      },
      alt_description: 'Local market'
    },
    {
      id: 8,
      urls: {
        small: 'https://images.unsplash.com/photo-1465778893808-9b3d1b443be4',
        regular: 'https://images.unsplash.com/photo-1465778893808-9b3d1b443be4'
      },
      alt_description: 'Natural waterfall'
    },
    {
      id: 9,
      urls: {
        small: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
        regular: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df'
      },
      alt_description: 'City skyline at night'
    }
  ];

  return defaultImages;
}

export async function translatePhrase(text: string, targetLang: string): Promise<string> {
  try {
    // Using MyMemory Translation API with email parameter to increase limit
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: text,
        langpair: `en|${targetLang}`,
        de: 'your-email@domain.com', // Add your email to increase daily limit
      },
    });

    if (response.data.responseStatus === 200) {
      return response.data.responseData.translatedText;
    }
    throw new Error(response.data.responseDetails);
  } catch (error) {
    console.error('Translation error:', error);
    return `${text} (translation unavailable)`;
  }
}

export async function getCulturalFacts(countryName: string): Promise<CulturalFact[]> {
  const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${countryName}`);
  const data = await response.json();
  
  // Also fetch additional cultural info
  const culturalResponse = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fields=languages,currencies,capital,demonyms`);
  const culturalData = await culturalResponse.json();

  return [
    {
      title: 'Overview',
      content: data.extract
    },
    {
      title: 'Languages',
      content: `Official languages: ${Object.values(culturalData[0].languages).join(', ')}`
    },
    {
      title: 'Currency',
      content: Object.values(culturalData[0].currencies)
        .map((c: any) => `${c.name} (${c.symbol})`)
        .join(', ')
    },
    {
      title: 'Capital City',
      content: `The capital city is ${culturalData[0].capital[0]}`
    }
  ];
}

export async function getLanguageLessons(country: Country): Promise<LanguageLesson[]> {
  const mainLanguage = Object.values(country.languages)[0];
  const phrases = ['Hello', 'Thank you', 'How are you?'];
  
  const lessons = await Promise.all(
    phrases.map(async (phrase) => ({
      phrase,
      translation: await translatePhrase(phrase, mainLanguage),
    }))
  );

  return lessons;
}

export async function generateTravelTimeline(country: Country): Promise<TravelTimeline> {
  // This would be replaced with an actual API call to a travel planning service
  // For now, we'll generate a mock timeline
  const timeline: TravelTimeline = {
    duration: 7,
    days: [
      {
        day: 1,
        title: 'Arrival & First Impressions',
        description: `Landing in ${country.capital[0]} International Airport`,
        location: country.capital[0],
        mood: 'Excited and curious',
        weatherForecast: 'Sunny with light clouds',
        activities: [
          {
            time: '14:00',
            title: 'Airport Arrival',
            description: 'Clear customs and collect baggage',
            type: 'transport',
          },
          {
            time: '15:30',
            title: 'Hotel Check-in',
            description: 'Settle in and freshen up at your boutique hotel',
            type: 'accommodation',
          },
          {
            time: '17:00',
            title: 'Evening Walk',
            description: 'Explore the local neighborhood and get oriented',
            type: 'leisure',
          },
          {
            time: '19:00',
            title: 'Welcome Dinner',
            description: 'Traditional local cuisine at a nearby restaurant',
            type: 'food',
          }
        ],
        tips: [
          'Download offline maps',
          'Keep some local currency handy',
          'Stay hydrated'
        ]
      },
      {
        day: 2,
        title: 'Cultural Immersion',
        description: 'Diving into local history and traditions',
        location: `${country.capital[0]} City Center`,
        mood: 'Culturally enriched',
        weatherForecast: 'Perfect for walking tours',
        activities: [
          {
            time: '09:00',
            title: 'Historical Tour',
            description: 'Guided walk through historic districts',
            type: 'culture',
          },
          {
            time: '12:30',
            title: 'Local Market Visit',
            description: 'Experience local life and try street food',
            type: 'food',
          },
          {
            time: '15:00',
            title: 'Museum Visit',
            description: 'Explore national history and art',
            type: 'culture',
          },
          {
            time: '18:00',
            title: 'Sunset Viewpoint',
            description: 'Panoramic city views at golden hour',
            type: 'sightseeing',
          }
        ],
        tips: [
          'Wear comfortable walking shoes',
          'Bring a camera',
          'Respect local customs'
        ]
      }
    ],
    totalCost: '$1,500 - $2,000',
    bestTimeToVisit: 'Spring (March to May)',
    weatherSummary: 'Mild temperatures with occasional rain',
    packingTips: [
      'Light, breathable clothing',
      'Comfortable walking shoes',
      'Universal power adapter',
      'Rain jacket'
    ],
    localCustoms: [
      'Remove shoes before entering homes',
      'Greet elders with respect',
      'Tipping customs vary by establishment'
    ]
  };

  return timeline;
}