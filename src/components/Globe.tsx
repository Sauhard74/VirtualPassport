import React, { useEffect, useRef } from 'react';
import { Globe as GlobeIcon } from 'lucide-react';

export function Globe() {
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const rotate = () => {
      globe.style.transform = `rotate(${Date.now() / 100}deg)`;
      requestAnimationFrame(rotate);
    };

    const animation = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(animation);
  }, []);

  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64">
      <div 
        ref={globeRef}
        className="absolute inset-0 flex items-center justify-center transform-gpu"
      >
        <GlobeIcon className="w-full h-full text-blue-500 opacity-80" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 rounded-full animate-pulse" />
    </div>
  );
}