import React from 'react';
import { useAuth } from '../context/AuthContext';
import { campusService } from '../services/campusService';
import { Clock, Calendar, CheckCircle, ArrowRight, Compass, Bot, MapPin } from 'lucide-react';

interface DashboardPageProps {
  onNavigateTab: (tab: string, targetBuildingId?: string, floor?: number, roomCode?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const rooms = campusService.getRooms();
  const buildings = campusService.getBuildings();
  const events = campusService.getEvents();
  const faculty = campusService.getFaculty();

  const availableCount = rooms.filter((r) => r.status === 'available').length;
  const schedule = user?.schedule || [];

  return (
    <div className="flex-1 bg-[#F4F5F7] p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 select-none font-sans">
      {/* Welcome Greeting Banner */}
      <div className="bg-white border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {user?.avatar && (
            <img src={user.avatar} alt={user.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-slate-200 shadow-xs shrink-0" />
          )}
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-200">
                {user?.role.toUpperCase()} PORTAL
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {user?.studentId ? `ID: ${user.studentId} • ` : ''}{user?.department || 'Computer Science & AI'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-light text-[#1A1A1A]">
              Good day, <span className="font-bold">{user?.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Digital Twin synchronized for your active profile and class schedule.
            </p>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => onNavigateTab('campus')}
            className="flex-1 md:flex-none px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Compass className="w-4 h-4 text-blue-400" />
            Launch 3D Twin
          </button>
          <button
            onClick={() => onNavigateTab('assistant')}
            className="flex-1 md:flex-none px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-blue-600" />
            Ask Copilot
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Available Rooms</div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-green-600">{availableCount}</div>
          <div className="text-xs text-slate-500 mt-1">Out of {rooms.length} total rooms</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Enrolled Classes Today</div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-blue-600">{schedule.length}</div>
          <div className="text-xs text-slate-500 mt-1">Personalized student schedule</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Live Events</div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-600">{events.length}</div>
          <div className="text-xs text-slate-500 mt-1">Campus-wide activities</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Faculty Available</div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-[#1A1A1A]">
            {faculty.filter((f) => f.status === 'AVAILABLE' || f.status === 'IN CLASS').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Ready for office hours</div>
        </div>
      </div>

      {/* Two Column Section: Schedule & Featured Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Personalized Student Class Schedule */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Personalized Class Schedule — {user?.name}
            </h3>
            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-200">
              {user?.studentId || 'STUDENT SESSION'}
            </span>
          </div>

          {schedule.length === 0 ? (
            <div className="p-6 bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
              No classes registered for today.
            </div>
          ) : (
            <div className="space-y-3">
              {schedule.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-3.5 border transition-all ${
                    idx === 0
                      ? 'bg-blue-50/80 border-blue-300 border-l-4 border-l-blue-600'
                      : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                          item.status === 'In Progress'
                            ? 'bg-green-600 text-white'
                            : item.status === 'Completed'
                            ? 'bg-slate-300 text-slate-700'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">{item.time}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-blue-600 bg-white px-2 py-0.5 border border-slate-200">
                      {item.courseCode}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-[#1A1A1A]">{item.courseName}</div>

                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2 pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>
                        Room <strong className="text-slate-900">{item.roomCode}</strong> • {item.buildingName} ({item.instructor})
                      </span>
                    </div>

                    <button
                      onClick={() => onNavigateTab('campus', item.buildingId, item.floor || 1, item.roomCode)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto bg-white px-2.5 py-1 border border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                      <span>Show in 3D</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Rooms Quick Panel */}
        <div className="bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">Instant Study Spaces</h3>
              <button
                onClick={() => onNavigateTab('rooms')}
                className="text-[10px] font-bold text-blue-600 hover:underline"
              >
                View All
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Found {availableCount} unlocked study rooms available for quiet work between your classes.
            </p>

            <div className="space-y-2">
              {rooms
                .filter((r) => r.status === 'available')
                .slice(0, 3)
                .map((r) => (
                  <div
                    key={r.id}
                    onClick={() => onNavigateTab('campus', r.buildingId, r.floor, r.code)}
                    className="p-3 bg-slate-50 border border-slate-200 hover:border-blue-600 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-mono font-bold text-slate-800 group-hover:text-blue-600">
                        {r.code} ({r.name})
                      </div>
                      <div className="text-[10px] text-slate-400">{r.buildingName} • Cap: {r.capacity} pax</div>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-green-600 bg-green-50 px-2 py-0.5 border border-green-200">
                      Open
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('rooms')}
            className="mt-6 w-full py-2.5 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Open Smart Room Finder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
