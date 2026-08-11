import React from 'react';
import { Radio, Compass, Layers } from 'lucide-react';

interface FooterProps {
  selectedFloor: number | null;
  onSelectFloor: (floor: number) => void;
  viewMode: '3d' | '2d';
  setViewMode: (mode: '3d' | '2d') => void;
}

export const Footer: React.FC<FooterProps> = ({
  selectedFloor,
  onSelectFloor,
  viewMode,
  setViewMode,
}) => {
  return (
    <footer className="h-11 bg-[#1A1A1A] text-white flex items-center justify-between px-6 z-50 text-xs border-t border-slate-800">
      {/* Left: System Status & Coordinates */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">Digital Twin Online</span>
        </div>

        <div className="h-3.5 w-[1px] bg-white/20 hidden sm:block"></div>

        <div className="hidden md:flex items-center gap-4 text-[10px] font-mono opacity-70">
          <span>LAT: 40.7128° N</span>
          <span>LNG: 74.0060° W</span>
          <span>ALT: 124m</span>
        </div>
      </div>

      {/* Right: Quick Floor Rail & View Mode Switcher */}
      <div className="flex items-center gap-6">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-white/10 p-0.5 border border-white/20">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest transition-all ${
              viewMode === '3d' ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-white/70'
            }`}
          >
            3D Spatial
          </button>
          <button
            onClick={() => setViewMode('2d')}
            className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest transition-all ${
              viewMode === '2d' ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-white/70'
            }`}
          >
            2D CAD Plan
          </button>
        </div>

        {/* Floor Quick Rail */}
        <div className="hidden sm:flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
          <span className="opacity-50">Floor Selector</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((fNum) => {
              const isSel = selectedFloor === fNum;
              return (
                <button
                  key={fNum}
                  onClick={() => onSelectFloor(fNum)}
                  className={`w-6 h-6 flex items-center justify-center text-[10px] font-mono transition-all ${
                    isSel
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-white/10 hover:bg-white/20 text-white/80'
                  }`}
                >
                  0{fNum}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
