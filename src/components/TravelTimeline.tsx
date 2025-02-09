import React from 'react';
import type { TravelTimeline as TravelTimelineType, TravelDay, TravelActivity } from '../types';
import { Calendar, Clock, MapPin, Sun, Umbrella, DollarSign, Lightbulb } from 'lucide-react';

interface TimelineProps {
  timeline: TravelTimelineType;
}

function ActivityCard({ activity }: { activity: TravelActivity }) {
  const icons = {
    food: '🍽️',
    sightseeing: '🏛️',
    culture: '🎭',
    transport: '🚗',
    accommodation: '🏨',
    leisure: '⛱️'
  };

  return (
    <div className="glass-card p-4 hover-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-blue-400 font-medium">{activity.time}</span>
        <span className="text-2xl">{icons[activity.type]}</span>
      </div>
      <h4 className="font-medium text-white mb-1">{activity.title}</h4>
      <p className="text-gray-400 text-sm">{activity.description}</p>
      {activity.location && (
        <div className="flex items-center mt-2 text-gray-400 text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          {activity.location}
        </div>
      )}
    </div>
  );
}

function DayCard({ day }: { day: TravelDay }) {
  return (
    <div className="glass-card p-6 hover-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold gradient-text">Day {day.day}</h3>
          <p className="text-lg text-white">{day.title}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center text-gray-400 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {day.location}
          </div>
          <div className="flex items-center text-gray-400 text-sm mt-1">
            <Sun className="w-4 h-4 mr-1" />
            {day.weatherForecast}
          </div>
        </div>
      </div>
      
      <p className="text-gray-300 mb-4">{day.description}</p>
      
      <div className="space-y-4">
        {day.activities.map((activity, index) => (
          <ActivityCard key={index} activity={activity} />
        ))}
      </div>

      <div className="mt-6 p-4 glass-card">
        <h4 className="font-medium text-white mb-2 flex items-center">
          <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
          Daily Tips
        </h4>
        <ul className="list-disc list-inside text-gray-400 space-y-1">
          {day.tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function TravelTimeline({ timeline }: TimelineProps) {
  return (
    <div className="space-y-8">
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold gradient-text mb-6">Your Travel Timeline</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center text-gray-300">
              <Calendar className="w-5 h-5 mr-2 text-blue-400" />
              <span>Duration: {timeline.duration} days</span>
            </div>
            <div className="flex items-center text-gray-300">
              <DollarSign className="w-5 h-5 mr-2 text-green-400" />
              <span>Estimated Cost: {timeline.totalCost}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Sun className="w-5 h-5 mr-2 text-yellow-400" />
              <span>Best Time: {timeline.bestTimeToVisit}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Umbrella className="w-5 h-5 mr-2 text-purple-400" />
              <span>Weather: {timeline.weatherSummary}</span>
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="font-medium text-white mb-2">Packing Essentials</h3>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              {timeline.packingTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {timeline.days.map((day) => (
          <DayCard key={day.day} day={day} />
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="font-medium text-white mb-4">Local Customs & Etiquette</h3>
        <div className="grid gap-4">
          {timeline.localCustoms.map((custom, index) => (
            <div key={index} className="glass-card p-4">
              <p className="text-gray-300">{custom}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}