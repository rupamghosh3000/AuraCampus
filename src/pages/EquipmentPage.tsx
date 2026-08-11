import React, { useState } from 'react';
import { campusService } from '../services/campusService';
import { Search, Cpu, CheckCircle, AlertTriangle } from 'lucide-react';

export const EquipmentPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const equipment = campusService.getEquipment();

  const filteredEquipment = equipment.filter(
    (eq) =>
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#F4F5F7] p-8 overflow-y-auto space-y-6 select-none font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border border-slate-200 shadow-2xs">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
            HARDWARE ASSETS
          </span>
          <h1 className="text-xl font-bold text-[#1A1A1A]">Equipment & Hardware Inventory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Search Raspberry Pi kits, GPU workstations, VR headsets, oscilloscopes, and 3D printers.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Raspberry Pi, GPU, VR..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-[#1A1A1A] outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((eq) => (
          <div key={eq.id} className="bg-white border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-600">
                {eq.category}
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-green-100 text-green-700">
                {eq.condition}
              </span>
            </div>

            <h3 className="text-base font-bold text-[#1A1A1A]">{eq.name}</h3>

            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-100 font-mono text-xs">
              <div>
                <span className="text-slate-400 text-[9px] uppercase block">Total Units</span>
                <span className="font-bold text-slate-800">{eq.totalUnits}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] uppercase block">Available</span>
                <span className="font-bold text-green-600">{eq.availableUnits}</span>
              </div>
            </div>

            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Location: {eq.labName} ({eq.buildingCode})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
