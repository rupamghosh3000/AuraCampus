import React from 'react';
import { CampusCopilotPanel } from '../components/assistant/CampusCopilotPanel';
import { campusService } from '../services/campusService';

interface AssistantPageProps {
  onShowIn3D: (buildingId: string, floor?: number, roomCode?: string) => void;
}

export const AssistantPage: React.FC<AssistantPageProps> = ({ onShowIn3D }) => {
  return (
    <div className="flex-1 bg-[#F4F5F7] p-3 sm:p-5 flex flex-col h-full overflow-hidden select-none">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col h-full">
        <CampusCopilotPanel
          onActionTrigger={(type, targetId) => {
            let bId = targetId || 'b-01';
            let fl: number | undefined = undefined;
            let rCode: string | undefined = undefined;

            if (type === 'SHOW_FACULTY') {
              const fac = campusService.getFaculty().find((f) => f.id === targetId || f.name.includes(targetId));
              if (fac) {
                const rm = campusService.getRoomById(fac.officeRoomId);
                bId = rm?.buildingId || 'b-01';
                fl = rm?.floor || 3;
                rCode = fac.officeRoomCode;
              }
            } else if (type === 'NAVIGATE' || type === 'HIGHLIGHT_ROOM') {
              const rm = campusService.getRoomById(targetId) || campusService.getRooms().find((r) => r.code === targetId);
              if (rm) {
                bId = rm.buildingId;
                fl = rm.floor;
                rCode = rm.code;
              }
            } else if (type === 'SHOW_EVENT') {
              const evt = campusService.getEvents().find((e) => e.id === targetId);
              if (evt) {
                bId = evt.buildingId;
                fl = evt.floor;
                rCode = evt.roomCode;
              }
            }

            onShowIn3D(bId, fl, rCode);
          }}
        />
      </div>
    </div>
  );
};
