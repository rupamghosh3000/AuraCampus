import React, { useState } from 'react';
import { campusService } from '../services/campusService';
import { Building, Room, Faculty, CampusEvent } from '../types';
import { Plus, Edit3, Trash2, ShieldAlert, Building2, Layers, Users, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'buildings' | 'rooms' | 'faculty' | 'events'>('buildings');
  
  const [buildings, setBuildings] = useState<Building[]>(campusService.getBuildings());
  const [rooms, setRooms] = useState<Room[]>(campusService.getRooms());
  const [faculty, setFaculty] = useState<Faculty[]>(campusService.getFaculty());
  const [events, setEvents] = useState<CampusEvent[]>(campusService.getEvents());

  // Form states for adding items
  const [showAddBuildingModal, setShowAddBuildingModal] = useState(false);
  const [newBName, setNewBName] = useState('');
  const [newBCode, setNewBCode] = useState('');
  const [newBZone, setNewBZone] = useState('North Campus');

  const handleAddBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBName && newBCode) {
      const created = campusService.addBuilding({
        name: newBName,
        code: newBCode,
        zone: newBZone,
        floorsCount: 3,
        totalCapacity: 500,
        currentLoadPercentage: 50,
        roomsCount: 6,
        labsCount: 2,
        facultyOfficesCount: 4,
        description: 'New administrative building node.',
        color: '#2563EB',
        position: [10, 0, 10],
        dimensions: [12, 12, 12],
      });
      setBuildings(campusService.getBuildings());
      setNewBName('');
      setNewBCode('');
      setShowAddBuildingModal(false);
    }
  };

  const [deletingBuildingId, setDeletingBuildingId] = useState<string | null>(null);

  const handleDeleteBuilding = (id: string) => {
    campusService.deleteBuilding(id);
    setBuildings(campusService.getBuildings());
    setDeletingBuildingId(null);
  };

  return (
    <div className="flex-1 bg-[#F4F5F7] p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 select-none font-sans">
      {/* Admin Top Header */}
      <div className="bg-white p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 border border-amber-200">
            ADMIN OPERATIONS CONTROL
          </span>
          <h1 className="text-xl font-bold text-[#1A1A1A]">Campus Data Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, update, and modify campus buildings, rooms, schedules, faculty, and events.
          </p>
        </div>

        <button
          onClick={() => setShowAddBuildingModal(true)}
          className="px-4 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          Add Building Node
        </button>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-white">
        <button
          onClick={() => setActiveSubTab('buildings')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeSubTab === 'buildings' ? 'border-b-2 border-amber-600 text-amber-700 bg-amber-50/50' : 'text-slate-500 hover:text-[#1A1A1A]'
          }`}
        >
          Buildings ({buildings.length})
        </button>
        <button
          onClick={() => setActiveSubTab('rooms')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeSubTab === 'rooms' ? 'border-b-2 border-amber-600 text-amber-700 bg-amber-50/50' : 'text-slate-500 hover:text-[#1A1A1A]'
          }`}
        >
          Rooms & Spaces ({rooms.length})
        </button>
        <button
          onClick={() => setActiveSubTab('faculty')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeSubTab === 'faculty' ? 'border-b-2 border-amber-600 text-amber-700 bg-amber-50/50' : 'text-slate-500 hover:text-[#1A1A1A]'
          }`}
        >
          Faculty Directory ({faculty.length})
        </button>
        <button
          onClick={() => setActiveSubTab('events')}
          className={`px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
            activeSubTab === 'events' ? 'border-b-2 border-amber-600 text-amber-700 bg-amber-50/50' : 'text-slate-500 hover:text-[#1A1A1A]'
          }`}
        >
          Events ({events.length})
        </button>
      </div>

      {/* Buildings CRUD List */}
      {activeSubTab === 'buildings' && (
        <div className="bg-white border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="p-3 font-mono">Code</th>
                <th className="p-3">Building Name</th>
                <th className="p-3">Zone</th>
                <th className="p-3">Floors</th>
                <th className="p-3">Total Capacity</th>
                <th className="p-3">Current Load</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {buildings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-blue-600">{b.code}</td>
                  <td className="p-3 font-bold text-[#1A1A1A]">{b.name}</td>
                  <td className="p-3 text-slate-500">{b.zone}</td>
                  <td className="p-3 text-slate-700">{b.floorsCount} Floors</td>
                  <td className="p-3 font-mono">{b.totalCapacity} seats</td>
                  <td className="p-3 font-mono font-bold text-amber-600">{b.currentLoadPercentage}%</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteBuilding(b.id)}
                      className="p-1 text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Building"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rooms CRUD List */}
      {activeSubTab === 'rooms' && (
        <div className="bg-white border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="p-3 font-mono">Room Code</th>
                <th className="p-3">Room Name</th>
                <th className="p-3">Building</th>
                <th className="p-3">Floor</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {rooms.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-blue-600">{r.code}</td>
                  <td className="p-3 font-bold text-[#1A1A1A]">{r.name}</td>
                  <td className="p-3 text-slate-600">{r.buildingName}</td>
                  <td className="p-3 font-mono">Floor 0{r.floor}</td>
                  <td className="p-3 font-mono">{r.capacity} seats</td>
                  <td className="p-3">
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 ${
                        r.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Faculty CRUD List */}
      {activeSubTab === 'faculty' && (
        <div className="bg-white border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="p-3">Name</th>
                <th className="p-3">Department</th>
                <th className="p-3">Office</th>
                <th className="p-3">Building</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {faculty.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-[#1A1A1A]">{f.name}</td>
                  <td className="p-3 text-slate-600">{f.department}</td>
                  <td className="p-3 font-mono font-bold text-blue-600">{f.officeRoomCode}</td>
                  <td className="p-3 text-slate-600">{f.buildingName}</td>
                  <td className="p-3 font-bold text-green-600 uppercase text-[10px]">{f.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Events List */}
      {activeSubTab === 'events' && (
        <div className="bg-white border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="p-3">Event Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Location</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-[#1A1A1A]">{evt.title}</td>
                  <td className="p-3 text-slate-600">{evt.category}</td>
                  <td className="p-3 font-bold text-blue-600">{evt.locationName}</td>
                  <td className="p-3 font-mono">{evt.startTime} – {evt.endTime}</td>
                  <td className="p-3 font-bold uppercase text-amber-700 text-[10px]">{evt.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Building Modal */}
      {showAddBuildingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white border border-slate-300 w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">Add Building Entity</h3>

            <form onSubmit={handleAddBuilding} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Building Code</label>
                <input
                  type="text"
                  required
                  value={newBCode}
                  onChange={(e) => setNewBCode(e.target.value)}
                  placeholder="e.g. B-09"
                  className="w-full p-2 bg-slate-50 border border-slate-200 text-xs font-mono font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Building Name</label>
                <input
                  type="text"
                  required
                  value={newBName}
                  onChange={(e) => setNewBName(e.target.value)}
                  placeholder="e.g. Quantum Computing Wing"
                  className="w-full p-2 bg-slate-50 border border-slate-200 text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Campus Zone</label>
                <input
                  type="text"
                  value={newBZone}
                  onChange={(e) => setNewBZone(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 text-xs outline-none"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBuildingModal(false)}
                  className="flex-1 py-2 border border-slate-300 text-xs font-bold uppercase text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800"
                >
                  Save Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
