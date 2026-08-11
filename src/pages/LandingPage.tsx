import React from 'react';
import { ArrowRight, Compass, ShieldCheck, Cpu, Zap, Radio, Layers, Bot, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onEnterCampus: () => void;
  onGoLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterCampus, onGoLogin }) => {
  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#1A1A1A] flex flex-col font-sans select-none">
      {/* Landing Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1A1A1A] flex items-center justify-center">
            <div className="w-4 h-4 border-t-2 border-r-2 border-white rotate-45"></div>
          </div>
          <span className="font-bold tracking-tight text-lg uppercase text-[#1A1A1A]">
            Aura <span className="font-light text-slate-500">Campus</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onGoLogin}
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 hover:text-[#1A1A1A] transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onEnterCampus}
            className="px-5 py-2 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <span>Enter Digital Twin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold uppercase tracking-widest">
            <Radio className="w-3.5 h-3.5 animate-pulse text-blue-600" />
            Next-Gen College Digital Twin Platform
          </div>

          <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-[#1A1A1A] leading-tight">
            Your Campus. <br />
            <span className="font-extrabold text-[#1A1A1A]">Digitally Reimagined.</span>
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
            Explore your college as a living 3D digital replica. Track real-time classroom availability, locate faculty offices, navigate campus spaces with spatial pathfinding, and query the intelligent Campus Copilot.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onEnterCampus}
              className="px-6 py-3.5 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>Launch 3D Twin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoLogin}
              className="px-6 py-3.5 bg-white border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-all"
            >
              Demo Credentials
            </button>
          </div>

          <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-6 text-slate-700">
            <div>
              <div className="text-2xl font-mono font-bold text-[#1A1A1A]">8</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">3D Buildings</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-[#1A1A1A]">30+</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Active Rooms</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-blue-600">100%</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Live Grounded AI</div>
            </div>
          </div>
        </div>

        {/* Isometric Blueprint Graphic Card */}
        <div className="relative bg-white border border-slate-200 shadow-2xl p-6 min-h-[400px] flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#CED4DA_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none"></div>

          <div className="flex items-center justify-between z-10">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">3D SPATIAL MAP PREVIEW</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 font-mono text-[10px] font-bold">SYSTEM ACTIVE</span>
          </div>

          {/* Blueprint Mock Render Box */}
          <div className="relative my-8 h-64 flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-slate-800 bg-slate-100/80 shadow-2xl rotate-45 transform skew-x-12 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 bg-blue-600 mb-2 flex items-center justify-center text-white font-mono font-bold text-xs">
                B-01
              </div>
              <div className="text-[11px] font-bold text-slate-800">SCIENCE HUB</div>
              <div className="text-[9px] font-mono text-slate-500 mt-1">4 Floors • 12 Rooms</div>
            </div>
          </div>

          <div className="z-10 flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-slate-700">Campus Copilot AI Ready</span>
            </div>
            <button
              onClick={onEnterCampus}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Explore Interactive Map</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="bg-white border-t border-slate-200 py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-blue-600">Core Architecture</span>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mt-1">Everything You Need To Navigate Campus Intelligence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 bg-[#1A1A1A] text-white flex items-center justify-center font-mono font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A] mb-2">Interactive 3D Digital Twin</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smooth 3D building inspection with exploded floor stacks, interactive room status heatmaps, and spatial camera controls.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A] mb-2">Smart Room & Resource Finder</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instantly calculate empty classrooms by capacity and schedule. Filter GPU workstations, Raspberry Pi kits, and VR headsets.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 bg-[#1A1A1A] text-white flex items-center justify-center font-mono font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A] mb-2">Campus Copilot Grounded AI</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ask natural questions like "Find an empty classroom for 60 students" and get actionable responses with 3D map route buttons.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
