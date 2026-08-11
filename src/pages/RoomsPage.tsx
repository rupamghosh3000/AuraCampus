import React, { useState } from 'react';
import { campusService } from '../services/campusService';
import { Room } from '../types';
import { Search, Filter, Calendar, Clock, Users, ArrowRight, CheckCircle, AlertCircle, Compass } from 'lucide-react';

interface RoomsPageProps {
  onShowIn3D: (buildingId: string, floor?: number, roomCode?: string) => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({ onShowIn3D }) => {
  const [minCapacity, setMinCapacity] = useState<number>(30);
  const [buildingFilter, setBuildingFilter] = useState<string>('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('14:00');

  const buildings = campusService.getBuildings();
  const availableRooms = campusService.findAvailableRooms({
    minCapacity,
    buildingId: buildingFilter,
    roomType: roomTypeFilter,
    startTime: timeFilter,
  });

  return (
    <div className="flex-1 bg-[#F4F5F7] p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 select-none font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 sm:p-5 border border-slate-200 shadow-2xs">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
            SPATIAL CALCULATOR
          </span>
          <h1 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">Smart Classroom & Space Finder</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Calculate real-time room availability across all campus buildings based on capacity, time window, and type.
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 sm:p-5 border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Minimum Capacity</label>
          <select
            value={minCapacity}
            onChange={(e) => setMinCapacity(Number(e.target.value))}
            className="w-full p-2 bg-slate-50 border border-slate-200 text-xs font-mono font-bold outline-none"
          >
            <option value={10}>10+ Seats</option>
            <option value={30}>30+ Seats</option>
            <option value={50}>50+ Seats (Large)</option>
            <option value={100}>100+ Seats (Auditorium)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Building Filter</label>
          <select
            value={buildingFilter}
            onChange={(e) => setBuildingFilter(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 text-xs font-semibold outline-none"
          >
            <option value="all">All Campus Buildings</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.code} - {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Space Type</label>
          <select
            value={roomTypeFilter}
            onChange={(e) => setRoomTypeFilter(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 text-xs font-semibold outline-none"
          >
            <option value="all">All Types</option>
            <option value="Classroom">Classroom</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Lecture Hall">Lecture Hall</option>
            <option value="Conference Room">Conference Room</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Requested Start Time</label>
          <input
            type="text"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            placeholder="e.g. 14:00"
            className="w-full p-2 bg-slate-50 border border-slate-200 text-xs font-mono font-bold outline-none"
          />
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-mono font-bold text-slate-600 uppercase">
          Found <span className="text-blue-600 font-bold">{availableRooms.length}</span> matching available spaces
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableRooms.map((r) => (
          <div
            key={r.id}
            className="bg-white border border-slate-200 hover:border-[#1A1A1A] p-5 transition-all shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-200">
                  {r.code}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-green-100 text-green-700">
                  Available
                </span>
              </div>

              <h3 className="text-base font-bold text-[#1A1A1A] mb-1">{r.name}</h3>
              <p className="text-xs text-slate-500 mb-3">
                {r.buildingName} • Floor 0{r.floor}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 bg-slate-50 border border-slate-100 mb-4 font-mono">
                <div>
                  <span className="text-slate-400 text-[9px] uppercase block">Capacity</span>
                  <span className="font-bold text-slate-800">{r.capacity} Seats</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] uppercase block">Type</span>
                  <span className="font-bold text-slate-800">{r.type}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Unlocked & Ready</span>
              <button
                onClick={() => onShowIn3D(r.buildingId, r.floor, r.code)}
                className="px-3 py-1.5 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-1"
              >
                <Compass className="w-3.5 h-3.5" />
                Show In 3D
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
