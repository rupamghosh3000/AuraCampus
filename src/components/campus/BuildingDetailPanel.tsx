import React from 'react';
import { Building, Room, Faculty, CampusEvent } from '../../types';
import { X, Users, Compass, Calendar, ArrowRight, ShieldCheck, CheckCircle, Clock, Building as BuildingIcon } from 'lucide-react';

interface BuildingDetailPanelProps {
  building: Building | null;
  rooms: Room[];
  faculty: Faculty[];
  events: CampusEvent[];
  selectedFloor: number | null;
  onSelectRoom: (room: Room) => void;
  onClose: () => void;
  onNavigateToBuilding: (buildingId: string) => void;
  onAskCopilotAboutBuilding: (buildingName: string) => void;
}

export const BuildingDetailPanel: React.FC<BuildingDetailPanelProps> = ({
  building,
  rooms,
  faculty,
  events,
  selectedFloor,
  onSelectRoom,
  onClose,
  onNavigateToBuilding,
  onAskCopilotAboutBuilding,
}) => {
  if (!building) return null;

  const floorRooms = rooms.filter(
    (r) => r.buildingId === building.id && (!selectedFloor || r.floor === selectedFloor)
  );

  const buildingEvents = events.filter((e) => e.buildingId === building.id);
  const buildingFaculty = faculty.filter((f) => f.buildingName === building.name);

  return (
    <aside className="w-full sm:w-88 md:w-[360px] max-w-full bg-white border-l border-slate-200 flex flex-col z-40 h-full overflow-hidden shadow-2xl select-none transition-all absolute sm:relative inset-y-0 right-0">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-2">
          <BuildingIcon className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Building Details {selectedFloor ? `• Floor 0${selectedFloor}` : ''}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-[#1A1A1A] p-1.5 rounded-none hover:bg-slate-200 transition-colors cursor-pointer"
          title="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Building Overview Card */}
      <div className="p-5 border-b border-slate-200 bg-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-blue-100 text-blue-700 border border-blue-200">
              {building.code}
            </span>
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">{building.zone} ZONE</span>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-400">{building.floorsCount} Floors</span>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#1A1A1A] leading-snug">{building.name}</h2>
          <p className="text-xs text-slate-500 leading-relaxed mt-1 font-medium">{building.description}</p>
        </div>

        {/* Capacity Metrics & Load */}
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Total Capacity</div>
            <div className="text-lg font-mono font-bold text-[#1A1A1A]">
              {building.totalCapacity} <span className="text-xs font-sans text-slate-400 font-normal">pax</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Live Occupancy Load</div>
            <div className="text-lg font-mono font-bold text-blue-600">{building.currentLoadPercentage}%</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onNavigateToBuilding(building.id)}
            className="flex-1 py-2 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Compass className="w-4 h-4 text-blue-400" />
            Route & Navigate
          </button>
          <button
            onClick={() => onAskCopilotAboutBuilding(building.name)}
            className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-widest hover:bg-blue-100 transition-all cursor-pointer"
          >
            Ask Copilot
          </button>
        </div>
      </div>

      {/* Main Scrollable Content Area with Expanded Sections */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Floor Rooms List - Expanded Section */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              {selectedFloor ? `Floor 0${selectedFloor} Rooms & Spaces` : 'All Building Rooms'}
            </h3>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-200">
              {floorRooms.length} Spaces
            </span>
          </div>

          {floorRooms.length === 0 ? (
            <div className="p-5 bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-medium">
              No rooms registered on Floor 0{selectedFloor}.
            </div>
          ) : (
            <div className="space-y-3">
              {floorRooms.map((r) => {
                const isAvail = r.status === 'available';
                return (
                  <div
                    key={r.id}
                    onClick={() => onSelectRoom(r)}
                    className="p-3.5 bg-white border border-slate-200 hover:border-blue-600 cursor-pointer transition-all shadow-2xs group space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-bold text-[#1A1A1A] group-hover:text-blue-600 transition-colors">
                          {r.code}
                        </span>
                        <span className="text-[11px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200">
                          {r.type}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-bold uppercase px-2 py-0.5 border ${
                          isAvail
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-slate-800">{r.name}</div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>Floor {r.floor} • Cap: <strong className="text-slate-800">{r.capacity} seats</strong></span>
                      {r.equipment && r.equipment.length > 0 && (
                        <span className="text-[11px] font-mono text-slate-500 truncate max-w-[160px]">
                          {r.equipment.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Resident Faculty Section - Expanded Details */}
        {buildingFaculty.length > 0 && (
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Resident Faculty & Offices
              </h3>
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-200">
                {buildingFaculty.length} Faculty
              </span>
            </div>

            <div className="space-y-3">
              {buildingFaculty.map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    const room = rooms.find((r) => r.id === f.officeRoomId || r.code === f.officeRoomCode);
                    if (room) onSelectRoom(room);
                  }}
                  className="p-3.5 bg-slate-50/70 border border-slate-200 hover:border-blue-600 cursor-pointer transition-all space-y-2.5 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={f.avatar}
                        alt={f.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-300 group-hover:border-blue-600 transition-colors"
                      />
                      <div>
                        <div className="text-sm font-bold text-[#1A1A1A] group-hover:text-blue-600 transition-colors">
                          {f.name}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">{f.title}</div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${
                        f.status === 'AVAILABLE'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {f.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
                    <div>
                      <span className="text-[11px] uppercase font-bold text-slate-400 block">Office Room</span>
                      <span className="font-mono font-bold text-slate-800 text-xs">{f.officeRoomCode}</span>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase font-bold text-slate-400 block">Office Hours</span>
                      <span className="font-medium text-slate-700 text-xs">{f.officeHours}</span>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 truncate pt-1">
                    {f.email}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Events in Building */}
        {buildingEvents.length > 0 && (
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                Hosted Events & Activities
              </h3>
            </div>

            <div className="space-y-3">
              {buildingEvents.map((evt) => (
                <div key={evt.id} className="p-3.5 bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-amber-900">
                    <span>{evt.category}</span>
                    <span className="bg-amber-200 text-amber-900 px-1.5 py-0.5">{evt.status}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">{evt.title}</div>
                  <div className="text-xs text-slate-600 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.startTime} – {evt.endTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
