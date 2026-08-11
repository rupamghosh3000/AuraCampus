import React, { useState } from 'react';
import { Building, Room } from '../../types';
import { ChevronDown, ChevronRight, Building2, Layers, Cpu, Zap, Activity } from 'lucide-react';

interface SidebarProps {
  buildings: Building[];
  selectedBuilding: Building | null;
  selectedFloor: number | null;
  onSelectBuilding: (b: Building | null) => void;
  onSelectFloor: (floor: number) => void;
  activeTab: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  buildings,
  selectedBuilding,
  selectedFloor,
  onSelectBuilding,
  onSelectFloor,
  activeTab,
}) => {
  const [expandedBuildingId, setExpandedBuildingId] = useState<string | null>(selectedBuilding?.id || 'b-01');

  const toggleExpand = (id: string) => {
    if (expandedBuildingId === id) {
      setExpandedBuildingId(null);
    } else {
      setExpandedBuildingId(id);
      const b = buildings.find((item) => item.id === id);
      if (b) onSelectBuilding(b);
    }
  };

  return (
    <aside className="hidden sm:flex w-64 lg:w-72 bg-white border-r border-slate-200 flex-col z-40 h-full overflow-hidden select-none shrink-0">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Campus Explorer</span>
        </div>
        <span className="text-xs font-mono text-slate-400 font-semibold">{buildings.length} BUILDINGS</span>
      </div>

      {/* Buildings & Floor Hierarchy Tree */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {buildings.map((b) => {
          const isSelected = selectedBuilding?.id === b.id;
          const isExpanded = expandedBuildingId === b.id;

          return (
            <div key={b.id} className="space-y-0.5">
              {/* Building Row */}
              <div
                onClick={() => {
                  onSelectBuilding(b);
                  toggleExpand(b.id);
                }}
                className={`group flex items-center justify-between p-2.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-100 border-l-2 border-[#1A1A1A] text-[#1A1A1A]'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-slate-400 w-8">{b.code}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-tight">{b.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{b.roomsCount} Rooms • {b.floorsCount} Floors</span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>

              {/* Sub-floors list if expanded */}
              {isExpanded && (
                <div className="pl-9 pr-2 py-1.5 space-y-1 bg-slate-50/60 border-l border-slate-200 ml-4 my-1">
                  {Array.from({ length: b.floorsCount }, (_, i) => i + 1).map((fNum) => {
                    const isFloorSel = isSelected && selectedFloor === fNum;
                    return (
                      <div
                        key={fNum}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBuilding(b);
                          onSelectFloor(fNum);
                        }}
                        className={`text-xs px-2 py-1 cursor-pointer flex items-center justify-between transition-colors ${
                          isFloorSel
                            ? 'text-blue-600 font-bold bg-blue-50 border-l-2 border-blue-600'
                            : 'text-slate-600 hover:text-[#1A1A1A] hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${isFloorSel ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                          <span>Floor 0{fNum}</span>
                        </div>
                        {isFloorSel && <span className="text-[9px] font-mono font-semibold text-blue-500">(Active)</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Campus Operational Status Rail */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/80">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3">
          <Activity className="w-3 h-3 text-green-500" />
          <span>Operational Telemetry</span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-600 font-medium">Power Grid Load</span>
              <span className="font-mono font-bold text-slate-800">842 kW</span>
            </div>
            <div className="w-full bg-slate-200 h-1">
              <div className="bg-green-500 h-1 w-[68%]"></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-600 font-medium">Network Throughput</span>
              <span className="font-mono font-bold text-slate-800">4.2 Gbps</span>
            </div>
            <div className="w-full bg-slate-200 h-1">
              <div className="bg-blue-600 h-1 w-[82%]"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
