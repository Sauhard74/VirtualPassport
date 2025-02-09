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
  const defaultImages = [
    'https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg',    // Eiffel Tower
    'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',      // Mountains
    'https://images.pexels.com/photos/1485894/pexels-photo-1485894.jpeg',    // Beach
    'https://images.pexels.com/photos/427679/pexels-photo-427679.jpeg',      // City
    'https://images.pexels.com/photos/2440021/pexels-photo-2440021.jpeg',    // Temple
    'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',    // Desert
    'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg',    // Lake
    'https://images.pexels.com/photos/2563681/pexels-photo-2563681.jpeg',    // Waterfall
    'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg'     // Village
  ];

  try {
    return defaultImages.map((url, index) => ({
      id: index,
      urls: {
        small: url,
        regular: url
      },
      alt_description: `Travel destination ${index + 1}`
    }));
  } catch (error) {
    console.error('Failed to load images:', error);
    return [];
  }
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