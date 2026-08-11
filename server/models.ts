import mongoose, { Schema, Document } from 'mongoose';

export interface IBuilding {
  id: string;
  code: string;
  name: string;
  zone?: string;
  floorsCount: number;
  totalCapacity: number;
  currentLoadPercentage: number;
  roomsCount: number;
  labsCount: number;
  facultyOfficesCount: number;
  description?: string;
  color?: string;
  position?: number[];
  dimensions?: number[];
}

export interface IRoom {
  id: string;
  code: string;
  name: string;
  buildingId: string;
  buildingName?: string;
  floor: number;
  capacity: number;
  type: string;
  status: string;
  currentClass?: string;
  nextAvailableTime?: string;
  equipment?: string[];
  timetable?: { time?: string; status?: string; subject?: string }[];
}

export interface IFaculty {
  id: string;
  name: string;
  title?: string;
  department?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  officeRoomCode?: string;
  officeRoomId?: string;
  buildingName?: string;
  officeHours?: string;
  status?: string;
}

export interface ILab {
  id: string;
  code: string;
  name: string;
  buildingId: string;
  buildingName?: string;
  floor: number;
  status: string;
  supervisor?: string;
  equipment?: string[];
  maxCapacity?: number;
}

export interface IEvent {
  id: string;
  title: string;
  category?: string;
  locationName?: string;
  roomCode?: string;
  buildingId?: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  description?: string;
  organizer?: string;
  status?: string;
  attendeesCount?: number;
  maxCapacity?: number;
}

const BuildingSchema = new Schema<IBuilding>({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  zone: { type: String },
  floorsCount: { type: Number, default: 1 },
  totalCapacity: { type: Number, default: 0 },
  currentLoadPercentage: { type: Number, default: 0 },
  roomsCount: { type: Number, default: 0 },
  labsCount: { type: Number, default: 0 },
  facultyOfficesCount: { type: Number, default: 0 },
  description: { type: String },
  color: { type: String },
  position: { type: [Number] },
  dimensions: { type: [Number] },
}, { timestamps: true });

const RoomSchema = new Schema<IRoom>({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  buildingId: { type: String, required: true },
  buildingName: { type: String },
  floor: { type: Number, required: true },
  capacity: { type: Number, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  currentClass: { type: String },
  nextAvailableTime: { type: String },
  equipment: [{ type: String }],
  timetable: [{
    time: { type: String },
    status: { type: String },
    subject: { type: String },
  }],
}, { timestamps: true });

const FacultySchema = new Schema<IFaculty>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  title: { type: String },
  department: { type: String },
  email: { type: String },
  phone: { type: String },
  avatar: { type: String },
  officeRoomCode: { type: String },
  officeRoomId: { type: String },
  buildingName: { type: String },
  officeHours: { type: String },
  status: { type: String },
}, { timestamps: true });

const LabSchema = new Schema<ILab>({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  buildingId: { type: String, required: true },
  buildingName: { type: String },
  floor: { type: Number, required: true },
  status: { type: String, required: true },
  supervisor: { type: String },
  equipment: [{ type: String }],
  maxCapacity: { type: Number },
}, { timestamps: true });

const EventSchema = new Schema<IEvent>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String },
  locationName: { type: String },
  roomCode: { type: String },
  buildingId: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  date: { type: String },
  description: { type: String },
  organizer: { type: String },
  status: { type: String },
  attendeesCount: { type: Number },
  maxCapacity: { type: Number },
}, { timestamps: true });

export const BuildingModel = mongoose.models.Building || mongoose.model<IBuilding>('Building', BuildingSchema);
export const RoomModel = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
export const FacultyModel = mongoose.models.Faculty || mongoose.model<IFaculty>('Faculty', FacultySchema);
export const LabModel = mongoose.models.Lab || mongoose.model<ILab>('Lab', LabSchema);
export const EventModel = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
