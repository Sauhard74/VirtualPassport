import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { Stamp, ArrowLeft, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function VirtualPassport() {
  const { savedTrips } = useStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Filter unique country visits by date
  const uniqueTrips = savedTrips.reduce((acc, current) => {
    const key = `${current.country.name.common}_${format(new Date(current.visitDate), 'yyyy-MM-dd')}`;
    if (!acc.find(trip => 
      trip.country.name.common === current.country.name.common && 
      format(new Date(trip.visitDate), 'yyyy-MM-dd') === format(new Date(current.visitDate), 'yyyy-MM-dd')
    )) {
      acc.push(current);
    }
    return acc;
  }, [] as typeof savedTrips);

  const uniqueCountries = new Set(savedTrips.map(trip => trip.country.name.common)).size;
  const totalPages = uniqueTrips.length;
  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 0;

  const handleToggleBook = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setCurrentPage(0);
    }
  };

  const handleNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPage === totalPages - 1) {
      setIsOpen(false);
      setCurrentPage(0);
      return;
    }
    setCurrentPage(p => p + 1);
  };

  const handlePrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPage(p => p - 1);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1a1a1a_0%,_#0A0A0A_100%)]" />
      
      <div className="relative container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className="inline-block glass-card px-6 py-3 rounded-full">
            <span className="text-gold font-serif">
              {uniqueCountries} {uniqueCountries === 1 ? 'Country' : 'Countries'} Visited
            </span>
          </div>
        </div>

        <div className="max-w-[375px] mx-auto perspective-1000">
          <div className="book-container" onClick={handleToggleBook}>
            <div className={`passport-cover ${isOpen ? 'open' : ''}`}>
              <div className="text-center space-y-4 p-8">
                <Globe className="w-12 h-12 mx-auto text-gold" />
                <div className="emblem" />
                <h1 className="text-xl font-serif text-gold uppercase tracking-widest">Virtual Passport</h1>
                <div className="text-gold/80 font-serif text-sm">
                  <div>World Explorer</div>
                  <div>Digital Citizenship</div>
                </div>
              </div>
            </div>

            {isOpen && (
              <>
                <div className="passport-pages">
                  {uniqueTrips.map((trip, index) => (
                    <div 
                      key={trip.visitDate}
                      className={`passport-page ${currentPage === index ? 'current' : ''}`}
                      style={{ 
                        transform: `rotateY(${(index - currentPage) * 180}deg)`,
                        opacity: currentPage === index ? 1 : 0,
                        visibility: Math.abs(index - currentPage) <= 1 ? 'visible' : 'hidden'
                      }}
                    >
                      <div className="page-content">
                        <div className="page-number">{index + 1}</div>
                        <div className="visa-stamp">
                          <div className="stamp-header">
                            <img
                              src={trip.country.flags.svg}
                              alt={`${trip.country.name.common} flag`}
                              className="w-12 h-8 object-cover rounded"
                            />
                          </div>
                          <h2 className="country-name">{trip.country.name.common}</h2>
                          <div className="stamp-details">
                            <div>Date: {format(new Date(trip.visitDate), 'dd MMM yyyy')}</div>
                            <div>Capital: {trip.country.capital[0]}</div>
                            <div>Region: {trip.country.region}</div>
                            <div>Languages: {Object.values(trip.country.languages || {}).join(', ')}</div>
                          </div>
                          <div className="official-stamp" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="navigation-controls">
                  <button
                    onClick={handlePrevPage}
                    disabled={!canGoPrev}
                    className={`nav-button ${!canGoPrev ? 'disabled' : ''}`}
                  >
                    <ChevronLeft className="w-6 h-6 text-gold" />
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={!canGoNext}
                    className={`nav-button ${!canGoNext ? 'disabled' : ''}`}
                  >
                    <ChevronRight className="w-6 h-6 text-gold" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}