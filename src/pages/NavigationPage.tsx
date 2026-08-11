import React, { useState } from 'react';
import { campusService } from '../services/campusService';
import { NavigationPath } from '../types';
import { Compass, MapPin, ArrowRight, Clock, Footprints, Search } from 'lucide-react';

interface NavigationPageProps {
  onLaunchIn3D: (path: NavigationPath) => void;
}

export const NavigationPage: React.FC<NavigationPageProps> = ({ onLaunchIn3D }) => {
  const nodes = campusService.getNavigationNodes();
  const rooms = campusService.getRooms();
  const [startNode, setStartNode] = useState(nodes[0]?.name || 'Main Campus Gate');
  const [endNode, setEndNode] = useState(nodes[1]?.name || 'Science Hub (CS & AI)');
  const [customSearch, setCustomSearch] = useState('');

  const route = campusService.calculateRoute(startNode, endNode);

  const handleCustomRoomSearch = (roomCode: string) => {
    setCustomSearch(roomCode);
    setEndNode(roomCode);
  };

  return (
    <div className="flex-1 bg-[#F4F5F7] p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 select-none font-sans">
      <div className="bg-white p-4 sm:p-5 border border-slate-200 shadow-2xs">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
          PATHFINDING ENGINE
        </span>
        <h1 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">Campus Spatial Navigation</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Select origin and target waypoints or type any room code to calculate optimal walking routes and 3D overlays.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Origin & Destination Selector */}
        <div className="bg-white p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">Select Waypoints</h3>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Start Origin Point</label>
            <select
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 text-xs font-semibold outline-none"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.name}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Destination</label>
            <select
              value={endNode}
              onChange={(e) => setEndNode(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 text-xs font-semibold outline-none mb-2"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.name}>
                  {n.name}
                </option>
              ))}
              {rooms.map((r) => (
                <option key={r.id} value={r.code}>
                  Room {r.code} ({r.name})
                </option>
              ))}
            </select>

            <div className="relative mt-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customSearch}
                onChange={(e) => handleCustomRoomSearch(e.target.value)}
                placeholder="Type specific Room Code (e.g. A-204)..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs font-mono focus:bg-white focus:border-blue-600 outline-none"
              />
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/60 border border-blue-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Total Distance:</span>
              <span className="font-mono font-bold text-[#1A1A1A]">
                {(route?.distance ?? route?.totalDistanceMeters ?? 0).toFixed(0)} meters
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Estimated Walk:</span>
              <span className="font-mono font-bold text-blue-600">
                {route?.estimatedTimeMinutes ?? route?.estimatedWalkMinutes ?? 1} min walk
              </span>
            </div>
          </div>

          <button
            onClick={() => onLaunchIn3D(route)}
            className="w-full py-3 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Compass className="w-4 h-4 text-blue-400" />
            Project 3D Path Overlay
          </button>
        </div>

        {/* Turn-by-Turn Steps List */}
        <div className="lg:col-span-2 bg-white p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
            <Footprints className="w-4 h-4 text-blue-600" />
            Turn-by-Turn Path Instructions
          </h3>

          <div className="space-y-3 border-l-2 border-blue-600 pl-4 py-1">
            {(route?.directions || route?.steps?.map((s) => s.instruction) || []).map((instruction, idx) => (
              <div key={idx} className="relative space-y-0.5">
                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white"></div>
                <div className="text-xs font-bold text-[#1A1A1A]">{instruction}</div>
                <div className="text-[10px] font-mono text-slate-400">Waypoint step {idx + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
