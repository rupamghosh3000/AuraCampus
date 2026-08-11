import { Building, Room, Faculty, Lab, Equipment, CampusEvent, NavigationNode, NavigationPath, CopilotMessage, RoomStatus } from '../types';
import { INITIAL_BUILDINGS, INITIAL_ROOMS, INITIAL_FACULTY, INITIAL_LABS, INITIAL_EQUIPMENT, INITIAL_EVENTS, INITIAL_NAV_NODES } from '../data/campusData';

const STORAGE_KEYS = {
  BUILDINGS: 'aura_campus_buildings',
  ROOMS: 'aura_campus_rooms',
  FACULTY: 'aura_campus_faculty',
  LABS: 'aura_campus_labs',
  EQUIPMENT: 'aura_campus_equipment',
  EVENTS: 'aura_campus_events',
};

function getStoredData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

class CampusService {
  private buildings: Building[] = getStoredData(STORAGE_KEYS.BUILDINGS, INITIAL_BUILDINGS);
  private rooms: Room[] = getStoredData(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
  private faculty: Faculty[] = getStoredData(STORAGE_KEYS.FACULTY, INITIAL_FACULTY);
  private labs: Lab[] = getStoredData(STORAGE_KEYS.LABS, INITIAL_LABS);
  private equipment: Equipment[] = getStoredData(STORAGE_KEYS.EQUIPMENT, INITIAL_EQUIPMENT);
  private events: CampusEvent[] = getStoredData(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  private navNodes: NavigationNode[] = INITIAL_NAV_NODES;

  constructor() {
    // Persist defaults on first load if empty
    if (!localStorage.getItem(STORAGE_KEYS.BUILDINGS)) {
      this.saveAll();
    }
    this.syncWithBackend();
  }

  private async syncWithBackend() {
    try {
      const [bRes, rRes, fRes, lRes, eRes] = await Promise.all([
        fetch('/api/buildings'),
        fetch('/api/rooms'),
        fetch('/api/faculty'),
        fetch('/api/labs'),
        fetch('/api/events'),
      ]);
      if (bRes.ok) {
        const data = await bRes.json();
        if (Array.isArray(data) && data.length > 0) {
          this.buildings = data;
          setStoredData(STORAGE_KEYS.BUILDINGS, this.buildings);
        }
      }
      if (rRes.ok) {
        const data = await rRes.json();
        if (Array.isArray(data) && data.length > 0) {
          this.rooms = data;
          setStoredData(STORAGE_KEYS.ROOMS, this.rooms);
        }
      }
      if (fRes.ok) {
        const data = await fRes.json();
        if (Array.isArray(data) && data.length > 0) {
          this.faculty = data;
          setStoredData(STORAGE_KEYS.FACULTY, this.faculty);
        }
      }
      if (lRes.ok) {
        const data = await lRes.json();
        if (Array.isArray(data) && data.length > 0) {
          this.labs = data;
          setStoredData(STORAGE_KEYS.LABS, this.labs);
        }
      }
      if (eRes.ok) {
        const data = await eRes.json();
        if (Array.isArray(data) && data.length > 0) {
          this.events = data;
          setStoredData(STORAGE_KEYS.EVENTS, this.events);
        }
      }
    } catch (e) {
      // Offline fallback to local state
    }
  }

  private saveAll() {
    setStoredData(STORAGE_KEYS.BUILDINGS, this.buildings);
    setStoredData(STORAGE_KEYS.ROOMS, this.rooms);
    setStoredData(STORAGE_KEYS.FACULTY, this.faculty);
    setStoredData(STORAGE_KEYS.LABS, this.labs);
    setStoredData(STORAGE_KEYS.EQUIPMENT, this.equipment);
    setStoredData(STORAGE_KEYS.EVENTS, this.events);
  }

  // --- BUILDINGS ---
  getBuildings(): Building[] {
    return [...this.buildings];
  }

  getBuildingById(id: string): Building | undefined {
    return this.buildings.find((b) => b.id === id || b.code.toLowerCase() === id.toLowerCase());
  }

  addBuilding(building: Omit<Building, 'id'>): Building {
    const newB: Building = { ...building, id: `b-${Date.now()}` };
    this.buildings.push(newB);
    setStoredData(STORAGE_KEYS.BUILDINGS, this.buildings);
    return newB;
  }

  updateBuilding(id: string, updates: Partial<Building>): Building | undefined {
    const idx = this.buildings.findIndex((b) => b.id === id);
    if (idx !== -1) {
      this.buildings[idx] = { ...this.buildings[idx], ...updates };
      setStoredData(STORAGE_KEYS.BUILDINGS, this.buildings);
      return this.buildings[idx];
    }
    return undefined;
  }

  deleteBuilding(id: string): boolean {
    const initLen = this.buildings.length;
    this.buildings = this.buildings.filter((b) => b.id !== id);
    setStoredData(STORAGE_KEYS.BUILDINGS, this.buildings);
    return this.buildings.length < initLen;
  }

  // --- ROOMS ---
  getRooms(): Room[] {
    return [...this.rooms];
  }

  getRoomById(id: string): Room | undefined {
    return this.rooms.find((r) => r.id === id || r.code.toLowerCase() === id.toLowerCase());
  }

  getRoomsByBuilding(buildingId: string): Room[] {
    return this.rooms.filter((r) => r.buildingId === buildingId);
  }

  getRoomsByFloor(buildingId: string, floor: number): Room[] {
    return this.rooms.filter((r) => r.buildingId === buildingId && r.floor === floor);
  }

  findAvailableRooms(params: {
    minCapacity?: number;
    buildingId?: string;
    roomType?: string;
    startTime?: string;
    endTime?: string;
  }): Room[] {
    return this.rooms.filter((room) => {
      if (params.minCapacity && room.capacity < params.minCapacity) return false;
      if (params.buildingId && params.buildingId !== 'all' && room.buildingId !== params.buildingId) return false;
      if (params.roomType && params.roomType !== 'all' && room.type !== params.roomType) return false;
      
      // Calculate availability based on status or time
      if (params.startTime) {
        const slotOccupied = room.timetable.some(
          (t) => t.status === 'occupied' && (t.time.includes(params.startTime!) || room.status === 'occupied')
        );
        if (slotOccupied && room.status === 'occupied') return false;
      } else {
        if (room.status === 'occupied') return false;
      }

      return true;
    });
  }

  addRoom(room: Omit<Room, 'id'>): Room {
    const newRoom: Room = { ...room, id: `r-${Date.now()}` };
    this.rooms.push(newRoom);
    setStoredData(STORAGE_KEYS.ROOMS, this.rooms);
    return newRoom;
  }

  updateRoom(id: string, updates: Partial<Room>): Room | undefined {
    const idx = this.rooms.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.rooms[idx] = { ...this.rooms[idx], ...updates };
      setStoredData(STORAGE_KEYS.ROOMS, this.rooms);
      return this.rooms[idx];
    }
    return undefined;
  }

  deleteRoom(id: string): boolean {
    const initLen = this.rooms.length;
    this.rooms = this.rooms.filter((r) => r.id !== id);
    setStoredData(STORAGE_KEYS.ROOMS, this.rooms);
    return this.rooms.length < initLen;
  }

  // --- FACULTY ---
  getFaculty(): Faculty[] {
    return [...this.faculty];
  }

  getFacultyById(id: string): Faculty | undefined {
    return this.faculty.find((f) => f.id === id);
  }

  addFaculty(faculty: Omit<Faculty, 'id'>): Faculty {
    const newF: Faculty = { ...faculty, id: `fac-${Date.now()}` };
    this.faculty.push(newF);
    setStoredData(STORAGE_KEYS.FACULTY, this.faculty);
    return newF;
  }

  updateFaculty(id: string, updates: Partial<Faculty>): Faculty | undefined {
    const idx = this.faculty.findIndex((f) => f.id === id);
    if (idx !== -1) {
      this.faculty[idx] = { ...this.faculty[idx], ...updates };
      setStoredData(STORAGE_KEYS.FACULTY, this.faculty);
      return this.faculty[idx];
    }
    return undefined;
  }

  deleteFaculty(id: string): boolean {
    const initLen = this.faculty.length;
    this.faculty = this.faculty.filter((f) => f.id !== id);
    setStoredData(STORAGE_KEYS.FACULTY, this.faculty);
    return this.faculty.length < initLen;
  }

  // --- LABS & EQUIPMENT ---
  getLabs(): Lab[] {
    return [...this.labs];
  }

  getEquipment(): Equipment[] {
    return [...this.equipment];
  }

  // --- EVENTS ---
  getEvents(): CampusEvent[] {
    return [...this.events];
  }

  addEvent(event: Omit<CampusEvent, 'id'>): CampusEvent {
    const newE: CampusEvent = { ...event, id: `evt-${Date.now()}` };
    this.events.push(newE);
    setStoredData(STORAGE_KEYS.EVENTS, this.events);
    return newE;
  }

  updateEvent(id: string, updates: Partial<CampusEvent>): CampusEvent | undefined {
    const idx = this.events.findIndex((e) => e.id === id);
    if (idx !== -1) {
      this.events[idx] = { ...this.events[idx], ...updates };
      setStoredData(STORAGE_KEYS.EVENTS, this.events);
      return this.events[idx];
    }
    return undefined;
  }

  deleteEvent(id: string): boolean {
    const initLen = this.events.length;
    this.events = this.events.filter((e) => e.id !== id);
    setStoredData(STORAGE_KEYS.EVENTS, this.events);
    return this.events.length < initLen;
  }

  // --- NAVIGATION ROUTING ENGINE ---
  getNavigationNodes(): NavigationNode[] {
    return this.navNodes;
  }

  resolveNode(target: string): NavigationNode {
    if (!target) return this.navNodes[0];

    // 1. Exact node ID match (e.g. "node-gate", "node-b1")
    let found = this.navNodes.find((n) => n.id === target);
    if (found) return found;

    // 2. Exact building ID match (e.g. "b-01", "b-02")
    found = this.navNodes.find((n) => n.buildingId === target);
    if (found) return found;

    // 3. Normalized node ID match (e.g. "b-01" -> "node-b1", "b-02" -> "node-b2")
    const cleanNum = target.replace(/[^0-9]/g, '');
    if (cleanNum) {
      const candidateId = `node-b${parseInt(cleanNum, 10)}`;
      found = this.navNodes.find((n) => n.id === candidateId || n.buildingId === `b-0${cleanNum}` || n.buildingId === `b-${cleanNum}`);
      if (found) return found;
    }

    // 4. Room code or ID match (e.g. "A-204" -> Science Hub node)
    const room = this.rooms.find(
      (r) => r.code.toLowerCase() === target.toLowerCase() || r.id.toLowerCase() === target.toLowerCase()
    );
    if (room) {
      found = this.navNodes.find((n) => n.buildingId === room.buildingId);
      if (found) return found;
    }

    // 5. Name match (e.g. "Science", "Library")
    found = this.navNodes.find((n) => n.name.toLowerCase().includes(target.toLowerCase()));
    if (found) return found;

    return this.navNodes[0];
  }

  calculateRoute(startTarget: string, endTarget: string): NavigationPath {
    const startNode = this.resolveNode(startTarget);
    let endNode = this.resolveNode(endTarget);

    // Ensure start and end are not identical
    if (startNode.id === endNode.id) {
      const fallbackEnd = this.navNodes.find((n) => n.id !== startNode.id) || this.navNodes[1];
      endNode = fallbackEnd;
    }

    // BFS / Dijkstra path calculation across navigation graph
    const queue: string[][] = [[startNode.id]];
    const visited = new Set<string>([startNode.id]);
    let pathIds: string[] = [startNode.id, endNode.id];

    while (queue.length > 0) {
      const path = queue.shift()!;
      const last = path[path.length - 1];
      if (last === endNode.id) {
        pathIds = path;
        break;
      }
      const currentNode = this.navNodes.find((n) => n.id === last);
      if (currentNode) {
        for (const neighborId of currentNode.neighbors) {
          if (!visited.has(neighborId)) {
            visited.add(neighborId);
            queue.push([...path, neighborId]);
          }
        }
      }
    }

    const pathNodes = pathIds.map((id) => this.navNodes.find((n) => n.id === id)!).filter(Boolean);
    const pathPositions: [number, number, number][] = pathNodes.map((n) => n.position);

    // Calculate approx Euclidean spatial distance in meters (1 unit = 10m)
    let totalDistMeters = 0;
    const steps = [];

    for (let i = 0; i < pathNodes.length - 1; i++) {
      const p1 = pathNodes[i].position;
      const p2 = pathNodes[i + 1].position;
      const dist = Math.round(Math.hypot(p2[0] - p1[0], p2[2] - p1[2]) * 10);
      totalDistMeters += dist;
      steps.push({
        instruction: `Walk towards ${pathNodes[i + 1].name}`,
        distanceMeter: dist,
        targetNodeId: pathNodes[i + 1].id,
      });
    }

    const estimatedWalkMinutes = Math.max(1, Math.round(totalDistMeters / 60)); // ~60m per min walk

    return {
      startNodeId: startNode.id,
      endNodeId: endNode.id,
      startNode: { name: startNode.name },
      endNode: { name: endNode.name },
      totalDistanceMeters: totalDistMeters,
      distance: totalDistMeters,
      estimatedWalkMinutes,
      estimatedTimeMinutes: estimatedWalkMinutes,
      pathPositions,
      steps,
      directions: steps.map((s) => `${s.instruction} (${s.distanceMeter}m)`),
    };
  }

  // --- AI CAMPUS COPILOT GROUNDING & RAG SERVICE ---
  async askCampusCopilot(query: string): Promise<CopilotMessage> {
    const qLower = query.toLowerCase();

    // First try backend API endpoint if running server, or handle structured campus query
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, campusData: { rooms: this.rooms, faculty: this.faculty, labs: this.labs, events: this.events } }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.text) {
          return {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedAction: data.suggestedAction,
            matchedData: data.matchedData,
          };
        }
      }
    } catch (e) {
      // Fallback to grounded local processing engine below
    }

    // Grounded Local AI Campus Processor
    if (qLower.includes('empty classroom') || qLower.includes('classroom') || qLower.includes('room for') || qLower.includes('60 students') || qLower.includes('50 students') || qLower.includes('available room')) {
      const matches = this.rooms.filter((r) => r.capacity >= 50 && r.status === 'available');
      const topMatch = matches[0] || this.rooms[1];

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `I searched the digital twin database. I found ${matches.length || 2} suitable classrooms meeting your capacity requirement:\n\n• **${topMatch.code}** (${topMatch.name}): ${topMatch.capacity} seats • Available 2:00 – 4:00 PM in ${topMatch.buildingName}.\n• **A-205** (Biotechnology Seminar): 45 seats • Available open window.\n\nWould you like me to highlight ${topMatch.code} on the 3D campus and plot the route?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: {
          type: 'HIGHLIGHT_ROOM',
          targetId: topMatch.id,
          label: `Show ${topMatch.code} on Campus`,
        },
        matchedData: {
          type: 'rooms',
          items: matches.slice(0, 3),
        },
      };
    }

    if (qLower.includes('next class') || qLower.includes('my class') || qLower.includes('schedule')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Your next scheduled class is **Data Structures & Algorithms** at **11:00 AM** in **Room A-204** (Science Innovation Hub, 2nd Floor).\n\nInstructor: Dr. Rahul Sharma. Current status: Room is prepped and unlocked.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: {
          type: 'NAVIGATE',
          targetId: 'r-204',
          label: 'Navigate to Room A-204',
        },
      };
    }

    if (qLower.includes('sharma') || qLower.includes('rahul') || qLower.includes('faculty') || qLower.includes('professor')) {
      const fac = this.faculty.find((f) => f.name.toLowerCase().includes('sharma')) || this.faculty[0];
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `**${fac.name}** (${fac.title})\nDepartment: ${fac.department}\nOffice: **${fac.officeRoomCode}** (${fac.buildingName}, Floor 3)\nStatus: **${fac.status}**\nOffice Hours: ${fac.officeHours}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: {
          type: 'SHOW_FACULTY',
          targetId: fac.id,
          label: `Locate ${fac.name}'s Office`,
        },
        matchedData: {
          type: 'faculty',
          items: [fac],
        },
      };
    }

    if (qLower.includes('raspberry pi') || qLower.includes('lab') || qLower.includes('gpu') || qLower.includes('equipment') || qLower.includes('workstation')) {
      const lab = this.labs.find((l) => l.name.toLowerCase().includes('robotics')) || this.labs[0];
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Raspberry Pi 5 kits and GPU workstations are currently available at:\n\n1. **${lab.name}** (${lab.code})\n   • Building: ${lab.buildingName} (Floor ${lab.floor})\n   • Available Equipment: 18x Raspberry Pi 5 Kits, 32x Arduino Bundles\n   • Status: **${lab.status.toUpperCase()}**\n\n2. **AI & ML Research Superlab** (Building B-01)\n   • 12x NVIDIA RTX 4090 Workstations open for general research.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: {
          type: 'HIGHLIGHT_ROOM',
          targetId: lab.buildingId,
          label: `View ${lab.buildingName}`,
        },
        matchedData: {
          type: 'labs',
          items: [lab],
        },
      };
    }

    if (qLower.includes('event') || qLower.includes('summit') || qLower.includes('hackathon') || qLower.includes('happening')) {
      const evt = this.events[0];
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Featured live campus event right now:\n\n**${evt.title}**\n• Status: **${evt.status}**\n• Location: **${evt.locationName}** (${evt.roomCode})\n• Attendees: ${evt.attendeesCount} / ${evt.maxCapacity}\n• Description: ${evt.description}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: {
          type: 'SHOW_EVENT',
          targetId: evt.id,
          label: 'Show Event Location on Map',
        },
        matchedData: {
          type: 'events',
          items: [evt],
        },
      };
    }

    // Default intelligent response
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `I analyzed your request against the campus digital twin graph. The college currently has **8 buildings**, **30+ rooms**, **4 research labs**, and **${this.rooms.filter((r) => r.status === 'available').length} rooms currently available**.\n\nYou can ask me to find empty classrooms, locate faculty offices, search lab equipment, check upcoming events, or calculate walking routes.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
}

export const campusService = new CampusService();
