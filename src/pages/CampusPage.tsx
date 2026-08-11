import React, { useState, useEffect } from 'react';
import { ThreeCampusCanvas } from '../components/campus/ThreeCampusCanvas';
import { Sidebar } from '../components/layout/Sidebar';
import { BuildingDetailPanel } from '../components/campus/BuildingDetailPanel';
import { RoomDetailModal } from '../components/campus/RoomDetailModal';
import { campusService } from '../services/campusService';
import { Building, Room, NavigationPath, CampusEvent } from '../types';

interface CampusPageProps {
  initialBuildingId?: string | null;
  initialFloor?: number | null;
  initialRoomCode?: string | null;
  initialPath?: NavigationPath | null;
  viewMode?: '3d' | '2d';
  setViewMode?: (mode: '3d' | '2d') => void;
  onNavigateToTab?: (tab: string) => void;
}

export const CampusPage: React.FC<CampusPageProps> = ({
  initialBuildingId,
  initialFloor,
  initialRoomCode,
  initialPath,
  viewMode = '3d',
  setViewMode,
  onNavigateToTab,
}) => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activePath, setActivePath] = useState<NavigationPath | null>(initialPath || null);

  useEffect(() => {
    if (initialPath) {
      setActivePath(initialPath);
    }
  }, [initialPath]);

  useEffect(() => {
    const loadedBuildings = campusService.getBuildings();
    setBuildings(loadedBuildings);

    if (initialBuildingId) {
      const b = loadedBuildings.find(
        (item) =>
          item.id === initialBuildingId ||
          item.code.toLowerCase() === initialBuildingId.toLowerCase()
      );
      if (b) {
        setSelectedBuilding(b);
        setSelectedFloor(initialFloor ?? 1);

        if (initialRoomCode) {
          const matchedRoom = campusService.getRooms().find(
            (r) => r.buildingId === b.id && r.code.toLowerCase() === initialRoomCode.toLowerCase()
          );
          if (matchedRoom) {
            setSelectedRoom(matchedRoom);
            setSelectedFloor(matchedRoom.floor);
          }
        }
      }
    } else if (loadedBuildings.length > 0) {
      setSelectedBuilding(loadedBuildings[0]);
      setSelectedFloor(1);
    }
  }, [initialBuildingId, initialFloor, initialRoomCode]);

  const rooms = campusService.getRooms();
  const faculty = campusService.getFaculty();
  const events = campusService.getEvents();

  const handleSelectBuilding = (b: Building | null) => {
    setSelectedBuilding(b);
    if (b) {
      setSelectedFloor(1);
    } else {
      setSelectedFloor(null);
    }
  };

  const handleNavigateToBuilding = (buildingId: string) => {
    const route = campusService.calculateRoute('Main Campus Gate', buildingId);
    setActivePath(route);
  };

  const handleAskCopilot = (buildingName: string) => {
    if (onNavigateToTab) {
      onNavigateToTab('assistant');
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden relative bg-slate-100 h-full w-full">
      {/* Left Sidebar: Campus Explorer */}
      <Sidebar
        buildings={buildings}
        selectedBuilding={selectedBuilding}
        selectedFloor={selectedFloor}
        onSelectBuilding={handleSelectBuilding}
        onSelectFloor={(f) => setSelectedFloor(f)}
        activeTab="campus"
      />

      {/* Center 3D Digital Twin Stage */}
      <main className="flex-1 relative overflow-hidden h-full">
        {/* Active Route Overlay Bar if activePath is present */}
        {activePath && (
          <div className="absolute top-4 left-4 right-4 z-40 bg-[#1A1A1A]/95 text-white border border-blue-500/40 p-4 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-blue-600 px-2 py-0.5 text-white">
                  3D Route Active
                </span>
                <span className="text-xs font-mono font-bold text-blue-300">
                  {(activePath.distance ?? activePath.totalDistanceMeters ?? 0).toFixed(0)} meters • ~{activePath.estimatedTimeMinutes ?? activePath.estimatedWalkMinutes ?? 1} min walk
                </span>
              </div>
              <div className="text-sm font-bold text-white">
                From <span className="text-blue-300">{activePath.startNode?.name || activePath.startNodeId || 'Start'}</span> to{' '}
                <span className="text-green-400">{activePath.endNode?.name || activePath.endNodeId || 'Destination'}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (onNavigateToTab) onNavigateToTab('navigation');
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                View Step Directions
              </button>
              <button
                onClick={() => setActivePath(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors border border-slate-700 cursor-pointer"
              >
                Clear Route
              </button>
            </div>
          </div>
        )}

        <ThreeCampusCanvas
          buildings={buildings}
          selectedBuilding={selectedBuilding}
          selectedFloor={selectedFloor}
          selectedRoom={selectedRoom}
          activePath={activePath}
          activeEvents={events}
          viewMode={viewMode}
          onSelectBuilding={handleSelectBuilding}
          onSelectFloor={(f) => setSelectedFloor(f)}
          onSelectRoom={(r) => setSelectedRoom(r)}
        />
      </main>

      {/* Right Contextual Building Detail Panel */}
      {selectedBuilding && (
        <BuildingDetailPanel
          building={selectedBuilding}
          rooms={rooms}
          faculty={faculty}
          events={events}
          selectedFloor={selectedFloor}
          onSelectRoom={(r) => setSelectedRoom(r)}
          onClose={() => setSelectedBuilding(null)}
          onNavigateToBuilding={handleNavigateToBuilding}
          onAskCopilotAboutBuilding={handleAskCopilot}
        />
      )}

      {/* Room Detail Modal Popup */}
      <RoomDetailModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
        onNavigateToRoom={(code) => {
          const route = campusService.calculateRoute('Main Campus Gate', code);
          setActivePath(route);
        }}
      />
    </div>
  );
};
