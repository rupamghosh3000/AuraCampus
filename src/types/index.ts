export type UserRole = 'student' | 'faculty' | 'admin';

export interface ClassScheduleItem {
  id: string;
  time: string;
  courseCode: string;
  courseName: string;
  buildingId: string;
  buildingName: string;
  roomCode: string;
  floor?: number;
  instructor: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  studentId?: string;
  schedule?: ClassScheduleItem[];
}

export type RoomStatus = 'available' | 'occupied' | 'upcoming' | 'maintenance';

export interface TimeSlot {
  id: string;
  time: string; // e.g. "09:00 - 10:00"
  courseName: string;
  instructor: string;
  status: RoomStatus;
}

export interface Room {
  id: string;
  code: string; // e.g. "A-204"
  name: string;
  buildingId: string;
  buildingName: string;
  floor: number;
  capacity: number;
  type: 'Classroom' | 'Laboratory' | 'Lecture Hall' | 'Faculty Office' | 'Conference Room';
  status: RoomStatus;
  equipment: string[];
  timetable: TimeSlot[];
  coordinates?: { x: number; y: number; z: number };
}

export interface Floor {
  floorNumber: number;
  name: string;
  roomsCount: number;
  activeOccupancy: number;
}

export interface Building {
  id: string;
  code: string; // e.g. "B-01"
  name: string;
  zone: string;
  floorsCount: number;
  totalCapacity: number;
  currentLoadPercentage: number;
  roomsCount: number;
  labsCount: number;
  facultyOfficesCount: number;
  description: string;
  color: string;
  position: [number, number, number]; // [x, y, z] in 3D scene
  dimensions: [number, number, number]; // [width, height, depth]
}

export interface Faculty {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  officeRoomId: string;
  officeRoomCode: string;
  buildingName: string;
  status: 'AVAILABLE' | 'IN CLASS' | 'IN MEETING' | 'OFF CAMPUS';
  avatar: string;
  officeHours: string;
  courses: string[];
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  totalUnits: number;
  availableUnits: number;
  condition: 'Excellent' | 'Good' | 'Maintenance Required';
  labId: string;
  labName: string;
  buildingCode: string;
}

export interface Lab {
  id: string;
  name: string;
  code: string;
  buildingId: string;
  buildingName: string;
  floor: number;
  capacity: number;
  status: RoomStatus;
  leadFaculty: string;
  equipmentCount: number;
  keyEquipment: string[];
}

export interface CampusEvent {
  id: string;
  title: string;
  category: 'Tech' | 'Academic' | 'Workshop' | 'Cultural' | 'Sports';
  date: string;
  startTime: string;
  endTime: string;
  locationName: string;
  buildingId: string;
  roomCode: string;
  floor?: number;
  organizer: string;
  description: string;
  attendeesCount: number;
  maxCapacity: number;
  status: 'Live' | 'Upcoming' | 'Completed';
}

export interface NavigationNode {
  id: string;
  name: string;
  buildingId?: string;
  roomCode?: string;
  floor?: number;
  position: [number, number, number];
  neighbors: string[]; // Node IDs connected
}

export interface RouteStep {
  instruction: string;
  distanceMeter: number;
  targetNodeId: string;
}

export interface NavigationPath {
  startNodeId: string;
  endNodeId: string;
  startNode?: { name: string };
  endNode?: { name: string };
  totalDistanceMeters: number;
  distance: number;
  estimatedWalkMinutes: number;
  estimatedTimeMinutes: number;
  pathPositions: [number, number, number][];
  steps: RouteStep[];
  directions: string[];
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'HIGHLIGHT_ROOM' | 'NAVIGATE' | 'SHOW_FACULTY' | 'SHOW_EVENT';
    targetId: string;
    label: string;
  };
  matchedData?: {
    type: 'rooms' | 'faculty' | 'labs' | 'events' | 'equipment';
    items: any[];
  };
}
