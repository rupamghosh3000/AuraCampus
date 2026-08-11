import React, { useState } from 'react';
import { campusService } from '../services/campusService';
import { Search, MapPin, Mail, Phone, Calendar, Compass, Clock } from 'lucide-react';

interface FacultyPageProps {
  onShowIn3D: (buildingId: string, floor?: number, roomCode?: string) => void;
}

export const FacultyPage: React.FC<FacultyPageProps> = ({ onShowIn3D }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const faculty = campusService.getFaculty();

  const handleLocateOffice = (f: any) => {
    let buildingId = 'b-01';
    let floor = 1;
    const room = campusService.getRoomById(f.officeRoomId);
    if (room) {
      buildingId = room.buildingId;
      floor = room.floor;
    } else {
      const b = campusService.getBuildings().find((item) => item.name === f.buildingName);
      if (b) buildingId = b.id;
    }
    onShowIn3D(buildingId, floor, f.officeRoomCode);
  };

  const filteredFaculty = faculty.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#F4F5F7] p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 select-none font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 border border-slate-200 shadow-2xs">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
            CAMPUS DIRECTORY
          </span>
          <h1 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">Faculty & Office Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search professor offices, office hours, and check real-time availability across campus.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or department..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#1A1A1A] outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFaculty.map((f) => (
          <div key={f.id} className="bg-white border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-4">
              <img src={f.avatar} alt={f.name} className="w-14 h-14 rounded-full object-cover border border-slate-300" />
              <div>
                <h3 className="text-base font-bold text-[#1A1A1A]">{f.name}</h3>
                <p className="text-xs font-medium text-slate-500">{f.title}</p>
                <span className="inline-block mt-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200">
                  {f.department}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Office Room</span>
                <span className="font-mono font-bold text-[#1A1A1A]">
                  {f.officeRoomCode} ({f.buildingName})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Status</span>
                <span className="font-bold text-green-600 uppercase text-[10px]">{f.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Office Hours</span>
                <span className="font-medium text-slate-700 text-[11px]">{f.officeHours}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 font-mono">{f.email}</span>
              <button
                onClick={() => handleLocateOffice(f)}
                className="px-3 py-1.5 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                Locate Office
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
