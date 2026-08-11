import React from 'react';
import { campusService } from '../services/campusService';
import { Calendar, Clock, MapPin, Compass, Users } from 'lucide-react';

interface EventsPageProps {
  onShowIn3D: (buildingId: string, floor?: number, roomCode?: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onShowIn3D }) => {
  const events = campusService.getEvents();

  return (
    <div className="flex-1 bg-[#F4F5F7] p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 select-none font-sans">
      <div className="bg-white p-4 sm:p-5 border border-slate-200 shadow-2xs">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
          CAMPUS DISCOVERY
        </span>
        <h1 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">Events & Symposia</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Explore upcoming hackathons, tech summits, guest keynotes, and student activities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((evt) => (
          <div key={evt.id} className="bg-white border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-blue-100 text-blue-800">
                {evt.category}
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-amber-100 text-amber-800">
                {evt.status}
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#1A1A1A]">{evt.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{evt.description}</p>

            <div className="p-3 bg-slate-50 border border-slate-100 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-700">
                <span>Date & Time:</span>
                <span className="font-bold">{evt.date} • {evt.startTime} – {evt.endTime}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>Location:</span>
                <span className="font-bold text-blue-600">{evt.locationName} ({evt.roomCode})</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>Organizer:</span>
                <span>{evt.organizer}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-500">
                {evt.attendeesCount} / {evt.maxCapacity} Registered
              </span>
              <button
                onClick={() => onShowIn3D(evt.buildingId, evt.floor, evt.roomCode)}
                className="px-4 py-2 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                View Location on Map
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
