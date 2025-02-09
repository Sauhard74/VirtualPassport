import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { MapPin, Globe2, Book, MessageSquare, Trophy, Save, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from './Button';
import { Link, useNavigate } from 'react-router-dom';
import type { CulturalFact, LanguageLesson, TravelTimeline } from '../types';
import { getCulturalFacts, getLanguageLessons, getCountryImages, generateTravelTimeline } from '../services/api';
import { TravelTimeline as TimelineComponent } from './TravelTimeline';

export function CountryExplorer() {
  const { currentCountry, addSavedTrip } = useStore();
  const navigate = useNavigate();
  const [facts, setFacts] = useState<CulturalFact[]>([]);
  const [lessons, setLessons] = useState<LanguageLesson[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<TravelTimeline | null>(null);
  const [loading, setLoading] = useState({
    facts: true,
    lessons: true,
    images: true,
    timeline: true
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline'>('overview');

  useEffect(() => {
    if (!currentCountry) {
      navigate('/');
      return;
    }

    // Cultural Facts
    getCulturalFacts(currentCountry.name.common)
      .then(setFacts)
      .catch(error => {
        console.error('Failed to fetch cultural facts:', error);
        setFacts([{
          title: 'Basic Information',
          content: `${currentCountry.name.common} is a country in ${currentCountry.region}.`
        }]);
      })
      .finally(() => setLoading(prev => ({ ...prev, facts: false })));

    // Language Lessons
    getLanguageLessons(currentCountry)
      .then(setLessons)
      .catch(error => {
        console.error('Failed to fetch language lessons:', error);
        setLessons([]);
      })
      .finally(() => setLoading(prev => ({ ...prev, lessons: false })));

    // Images
    getCountryImages(currentCountry.name.common, currentCountry.capital[0])
      .then(setImages)
      .catch(console.error)
      .finally(() => setLoading(prev => ({ ...prev, images: false })));

    // Timeline
    generateTravelTimeline(currentCountry)
      .then(setTimeline)
      .catch(error => {
        console.error('Failed to generate timeline:', error);
        setTimeline(null);
      })
      .finally(() => setLoading(prev => ({ ...prev, timeline: false })));
  }, [currentCountry, navigate]);

  if (!currentCountry) return null;

  const handleSaveTrip = () => {
    addSavedTrip({
      country: currentCountry,
      visitDate: new Date().toISOString(),
      completed: ['visited'],
      timeline: timeline || undefined,
    });
    navigate('/passport');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1a1a1a_0%,_#0A0A0A_100%)]" />
      
      <div className="relative container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="glass-card p-6 mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={currentCountry.flags.svg}
              alt={`${currentCountry.name.common} flag`}
              className="w-16 h-12 object-cover rounded-lg"
            />
            <div>
              <h1 className="text-3xl font-bold gradient-text">{currentCountry.name.common}</h1>
              <p className="text-gray-400">Capital: {currentCountry.capital[0]}</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mb-8">
          <Button
            variant={activeTab === 'overview' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? 'glow' : ''}
          >
            <Globe2 className="mr-2 h-4 w-4" />
            Country Overview
          </Button>
          <Button
            variant={activeTab === 'timeline' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('timeline')}
            className={activeTab === 'timeline' ? 'glow' : ''}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Travel Timeline
          </Button>
        </div>

        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                  <Globe2 className="mr-2 text-blue-400" /> Map View
                </h2>
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-900">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${currentCountry.latlng[1]-1},${currentCountry.latlng[0]-1},${currentCountry.latlng[1]+1},${currentCountry.latlng[0]+1}&layer=mapnik&marker=${currentCountry.latlng[0]},${currentCountry.latlng[1]}`}
                  />
                </div>
              </div>

              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                  <Book className="mr-2 text-purple-400" /> Cultural Facts
                </h2>
                <div className="space-y-4">
                  {loading.facts ? (
                    <div className="text-gray-400">Loading cultural facts...</div>
                  ) : facts.length > 0 ? (
                    facts.map((fact) => (
                      <div key={fact.title} className="border-b border-white/10 pb-4">
                        <h3 className="font-medium text-blue-400">{fact.title}</h3>
                        <p className="text-gray-300">{fact.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400">No cultural facts available</div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                  <MessageSquare className="mr-2 text-green-400" /> Language Lessons
                </h2>
                <div className="space-y-4">
                  {loading.lessons ? (
                    <div className="text-gray-400">Loading language lessons...</div>
                  ) : lessons.length > 0 ? (
                    lessons.map((lesson) => (
                      <div key={lesson.phrase} className="glass-card p-4 hover-card">
                        <p className="font-medium text-white">{lesson.phrase}</p>
                        <p className="text-blue-400">{lesson.translation}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400">No language lessons available</div>
                  )}
                </div>
              </div>

              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                  <Trophy className="mr-2 text-yellow-400" /> Travel Challenge
                </h2>
                <div className="glass-card p-4">
                  <h3 className="font-medium text-white">Today's Challenge</h3>
                  <p className="text-gray-300">
                    Try cooking a traditional dish from {currentCountry.name.common}!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {loading.images ? (
                  <div className="col-span-3 text-center py-8 text-gray-400">
                    Loading images...
                  </div>
                ) : images.length > 0 ? (
                  images.slice(0, 9).map((image: any) => (
                    <div key={image.id} className="aspect-square rounded-xl overflow-hidden hover-card">
                      <img
                        src={image.urls.small}
                        alt={image.alt_description}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-gray-400">
                    No images available
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          timeline && <TimelineComponent timeline={timeline} />
        )}

        <div className="mt-8">
          <Button
            onClick={handleSaveTrip}
            className="w-full glow"
            size="lg"
          >
            <Save className="mr-2" /> Save This Trip
          </Button>
        </div>
      </div>
    </div>
  );
}