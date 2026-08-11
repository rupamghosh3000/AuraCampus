import React from 'react';
import { Room } from '../../types';
import { X, Clock, Users, Cpu, Calendar, Compass, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
  onNavigateToRoom: (roomCode: string) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ room, onClose, onNavigateToRoom }) => {
  if (!room) return null;

  const isAvailable = room.status === 'available';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-300 w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-[#1A1A1A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono font-bold px-2 py-0.5 bg-blue-600 text-white">{room.code}</span>
            <div>
              <h3 className="text-base font-bold tracking-tight">{room.name}</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                {room.buildingName} • Floor 0{room.floor}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 text-slate-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Status & Capacity Overview */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Current Status</div>
              <div className="flex items-center gap-1.5">
                {isAvailable ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-bold text-green-700 uppercase">Available</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold text-red-700 uppercase">Occupied</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Seating Capacity</div>
              <div className="text-sm font-mono font-bold text-[#1A1A1A]">{room.capacity} seats</div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Space Classification</div>
              <div className="text-xs font-semibold text-slate-700">{room.type}</div>
            </div>
          </div>

          {/* Installed Equipment */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              Installed Hardware & AV Equipment
            </h4>
            <div className="flex flex-wrap gap-2">
              {room.equipment.map((eq, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700"
                >
                  {eq}
                </span>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Today's Timetable Schedule
            </h4>
            <div className="space-y-2 border border-slate-200 divide-y divide-slate-100">
              {room.timetable.map((slot) => {
                const isOccupied = slot.status === 'occupied';
                return (
                  <div key={slot.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 font-mono text-slate-500 text-[11px] font-semibold w-28">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {slot.time}
                      </div>
                      <div>
                        <div className="font-bold text-[#1A1A1A]">{slot.courseName}</div>
                        <div className="text-[10px] text-slate-400">Instructor: {slot.instructor}</div>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 ${
                        isOccupied ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {slot.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onNavigateToRoom(room.code);
              onClose();
            }}
            className="px-5 py-2 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            Navigate to {room.code}
          </button>
        </div>
      </div>
    </div>
  );
};
