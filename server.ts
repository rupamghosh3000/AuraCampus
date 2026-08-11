import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { BuildingModel, RoomModel, FacultyModel, LabModel, EventModel } from './server/models';
import { INITIAL_BUILDINGS, INITIAL_ROOMS, INITIAL_FACULTY, INITIAL_LABS, INITIAL_EVENTS } from './src/data/campusData';

dotenv.config();

const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aura_campus';

let isMongoConnected = false;

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    isMongoConnected = true;
    console.log('MongoDB connected successfully');
    await seedDB();
  } catch (err) {
    console.warn('MongoDB connection failed or not available locally. Using in-memory fallback API data store.');
    isMongoConnected = false;
  }
}

// In-memory fallback data if Mongo is not running
let memoryBuildings = [...INITIAL_BUILDINGS];
let memoryRooms = [...INITIAL_ROOMS];
let memoryFaculty = [...INITIAL_FACULTY];
let memoryLabs = [...INITIAL_LABS];
let memoryEvents = [...INITIAL_EVENTS];

async function seedDB() {
  if (!isMongoConnected) return;
  try {
    const buildingCount = await BuildingModel.countDocuments();
    if (buildingCount === 0) {
      await BuildingModel.insertMany(INITIAL_BUILDINGS as any);
      await RoomModel.insertMany(INITIAL_ROOMS as any);
      await FacultyModel.insertMany(INITIAL_FACULTY as any);
      await LabModel.insertMany(INITIAL_LABS as any);
      await EventModel.insertMany(INITIAL_EVENTS as any);
      console.log('MongoDB seeded with initial campus data');
    }
  } catch (e) {
    console.error('Error seeding MongoDB:', e);
  }
}

// Initialize Gemini AI client lazily
let genAI: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI | null {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      genAI = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return genAI;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Try DB connection asynchronously
  connectDB();

  // --- HEALTH CHECK ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', mongoConnected: isMongoConnected });
  });

  // --- BUILDINGS API ---
  app.get('/api/buildings', async (req, res) => {
    if (isMongoConnected) {
      try {
        const buildings = await BuildingModel.find();
        return res.json(buildings);
      } catch (e) {
        return res.json(memoryBuildings);
      }
    }
    return res.json(memoryBuildings);
  });

  app.post('/api/buildings', async (req, res) => {
    const newB = { ...req.body, id: req.body.id || `b-${Date.now()}` };
    if (isMongoConnected) {
      try {
        const created = await BuildingModel.create(newB);
        return res.status(201).json(created);
      } catch (e) {
        memoryBuildings.push(newB);
        return res.status(201).json(newB);
      }
    }
    memoryBuildings.push(newB);
    return res.status(201).json(newB);
  });

  app.put('/api/buildings/:id', async (req, res) => {
    const { id } = req.params;
    if (isMongoConnected) {
      try {
        const updated = await BuildingModel.findOneAndUpdate({ id } as any, req.body, { new: true } as any);
        return res.json(updated);
      } catch (e) {
        const idx = memoryBuildings.findIndex(b => b.id === id);
        if (idx !== -1) memoryBuildings[idx] = { ...memoryBuildings[idx], ...req.body };
        return res.json(memoryBuildings[idx]);
      }
    }
    const idx = memoryBuildings.findIndex(b => b.id === id);
    if (idx !== -1) memoryBuildings[idx] = { ...memoryBuildings[idx], ...req.body };
    return res.json(memoryBuildings[idx]);
  });

  app.delete('/api/buildings/:id', async (req, res) => {
    const { id } = req.params;
    if (isMongoConnected) {
      try {
        await BuildingModel.deleteOne({ id } as any);
        return res.json({ success: true });
      } catch (e) {
        memoryBuildings = memoryBuildings.filter(b => b.id !== id);
        return res.json({ success: true });
      }
    }
    memoryBuildings = memoryBuildings.filter(b => b.id !== id);
    return res.json({ success: true });
  });

  // --- ROOMS API ---
  app.get('/api/rooms', async (req, res) => {
    if (isMongoConnected) {
      try {
        const rooms = await RoomModel.find();
        return res.json(rooms);
      } catch (e) {
        return res.json(memoryRooms);
      }
    }
    return res.json(memoryRooms);
  });

  app.post('/api/rooms', async (req, res) => {
    const newR = { ...req.body, id: req.body.id || `r-${Date.now()}` };
    if (isMongoConnected) {
      try {
        const created = await RoomModel.create(newR);
        return res.status(201).json(created);
      } catch (e) {
        memoryRooms.push(newR);
        return res.status(201).json(newR);
      }
    }
    memoryRooms.push(newR);
    return res.status(201).json(newR);
  });

  app.put('/api/rooms/:id', async (req, res) => {
    const { id } = req.params;
    if (isMongoConnected) {
      try {
        const updated = await RoomModel.findOneAndUpdate({ id } as any, req.body, { new: true } as any);
        return res.json(updated);
      } catch (e) {
        const idx = memoryRooms.findIndex(r => r.id === id);
        if (idx !== -1) memoryRooms[idx] = { ...memoryRooms[idx], ...req.body };
        return res.json(memoryRooms[idx]);
      }
    }
    const idx = memoryRooms.findIndex(r => r.id === id);
    if (idx !== -1) memoryRooms[idx] = { ...memoryRooms[idx], ...req.body };
    return res.json(memoryRooms[idx]);
  });

  app.delete('/api/rooms/:id', async (req, res) => {
    const { id } = req.params;
    if (isMongoConnected) {
      try {
        await RoomModel.deleteOne({ id } as any);
        return res.json({ success: true });
      } catch (e) {
        memoryRooms = memoryRooms.filter(r => r.id !== id);
        return res.json({ success: true });
      }
    }
    memoryRooms = memoryRooms.filter(r => r.id !== id);
    return res.json({ success: true });
  });

  // --- FACULTY API ---
  app.get('/api/faculty', async (req, res) => {
    if (isMongoConnected) {
      try {
        const faculty = await FacultyModel.find();
        return res.json(faculty);
      } catch (e) {
        return res.json(memoryFaculty);
      }
    }
    return res.json(memoryFaculty);
  });

  app.post('/api/faculty', async (req, res) => {
    const newF = { ...req.body, id: req.body.id || `fac-${Date.now()}` };
    if (isMongoConnected) {
      try {
        const created = await FacultyModel.create(newF);
        return res.status(201).json(created);
      } catch (e) {
        memoryFaculty.push(newF);
        return res.status(201).json(newF);
      }
    }
    memoryFaculty.push(newF);
    return res.status(201).json(newF);
  });

  // --- LABS API ---
  app.get('/api/labs', async (req, res) => {
    if (isMongoConnected) {
      try {
        const labs = await LabModel.find();
        return res.json(labs);
      } catch (e) {
        return res.json(memoryLabs);
      }
    }
    return res.json(memoryLabs);
  });

  // --- EVENTS API ---
  app.get('/api/events', async (req, res) => {
    if (isMongoConnected) {
      try {
        const events = await EventModel.find();
        return res.json(events);
      } catch (e) {
        return res.json(memoryEvents);
      }
    }
    return res.json(memoryEvents);
  });

  // --- AI COPILOT ENDPOINT WITH GEMINI API ---
  app.post('/api/ai/chat', async (req, res) => {
    const { query, campusData } = req.body;
    const aiClient = getGenAIClient();

    if (aiClient) {
      try {
        const prompt = `You are Aura Campus Copilot, an AI digital twin spatial assistant for a modern college campus.
Context Data:
- Total Rooms: ${campusData?.rooms?.length || 30}
- Total Faculty: ${campusData?.faculty?.length || 10}
- Total Labs: ${campusData?.labs?.length || 4}
- Total Events: ${campusData?.events?.length || 4}

User Query: "${query}"

Provide a concise, helpful, spatial-aware response. If the user asks for a room, faculty, or lab, mention building details, floor, and availability status.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
        });

        const replyText = response.text || 'I processed your campus query through the Digital Twin engine.';
        return res.json({ text: replyText });
      } catch (err) {
        console.error('Gemini API call failed:', err);
      }
    }

    return res.json({ text: null }); // Fallback to client grounded engine
  });

  // Vite middleware for dev / static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
