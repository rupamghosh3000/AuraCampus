import React from 'react';
import { campusService } from '../services/campusService';
import { Cpu, Users, Compass, CheckCircle, AlertTriangle } from 'lucide-react';

interface LabsPageProps {
  onShowIn3D: (buildingId: string, floor?: number, roomCode?: string) => void;
}

export const LabsPage: React.FC<LabsPageProps> = ({ onShowIn3D }) => {
  const labs = campusService.getLabs();

  return (
    <div className="flex-1 bg-[#F4F5F7] p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 select-none font-sans">
      <div className="bg-white p-4 sm:p-5 border border-slate-200 shadow-2xs">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
          RESEARCH FACILITY
        </span>
        <h1 className="text-lg sm:text-xl font-bold text-[#1A1A1A]">Campus Laboratories Directory</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Explore specialized AI, robotics, XR media, and cybersecurity research laboratories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {labs.map((lab) => (
          <div key={lab.id} className="bg-white border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-blue-100 text-blue-800">
                {lab.code}
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-green-100 text-green-700">
                {lab.status}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#1A1A1A]">{lab.name}</h3>
              <p className="text-xs text-slate-500">{lab.buildingName} • Floor 0{lab.floor}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Lead Faculty:</span>
                <span className="font-bold text-[#1A1A1A]">{lab.leadFaculty}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Workstations:</span>
                <span className="font-mono font-bold text-[#1A1A1A]">{lab.capacity} Units</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Key Installed Hardware</span>
              <div className="flex flex-wrap gap-1.5">
                {lab.keyEquipment.map((eq, idx) => (
                  <span key={idx} className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200">
                    {eq}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => onShowIn3D(lab.buildingId, lab.floor, lab.code)}
                className="px-4 py-2 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                View Lab in 3D
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
