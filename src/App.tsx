import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Globe } from './components/Globe';
import { Button } from './components/Button';
import { CountryExplorer } from './components/CountryExplorer';
import { VirtualPassport } from './components/VirtualPassport';
import { Plane, BookOpen, Sparkles } from 'lucide-react';
import { useStore } from './store/useStore';
import { getRandomCountry } from './services/api';

function LandingPage() {
  const { setCurrentCountry } = useStore();
  const navigate = useNavigate();

  const handleStartJourney = async () => {
    try {
      const country = await getRandomCountry();
      setCurrentCountry(country);
      navigate('/explore');
    } catch (error) {
      console.error('Failed to start journey:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1a1a1a_0%,_#0A0A0A_100%)]" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-screen space-y-12 text-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="gradient-text">Virtual Travel</span>
              <br />
              Experience
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Embark on a daily adventure to discover new countries, cultures, and experiences.
              Let AI be your guide in this unique travel journey!
            </p>
          </div>

          <div className="relative w-72 h-72 animate-float">
            <Globe />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="group glow"
              onClick={handleStartJourney}
            >
              <div className="relative z-10 flex items-center">
                <Plane className="mr-2 h-5 w-5" />
                Start Your Journey
                <Sparkles className="ml-2 h-4 w-4 animate-pulse" />
              </div>
            </Button>

            <Link to="/passport">
              <Button
                size="lg"
                variant="secondary"
                className="glass-card"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                View Passport
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-5xl mx-auto">
            {[
              { title: 'Street Views', description: 'Explore cities in real-time through immersive street views', icon: '🌆' },
              { title: 'Cultural Facts', description: 'Discover rich traditions and fascinating local customs', icon: '🏺' },
              { title: 'Language Lessons', description: 'Learn essential phrases from native speakers', icon: '🗣️' },
            ].map((feature) => (
              <div
                key={feature.title}
                className="glass-card p-8 hover-card"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<CountryExplorer />} />
        <Route path="/passport" element={<VirtualPassport />} />
      </Routes>
    </Router>
  );
}

export default App;