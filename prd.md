# Product Requirements Document (PRD)

# Digital Twin of a College

**Version:** 1.0  
**Product Type:** Full-Stack Web Application  
**Target:** Hackathon / Academic Project  
**Primary Users:** Students, Faculty, Administrators

---

## 1. Product Overview

### 1.1 Product Name

**Digital Twin of a College**

### 1.2 Product Vision

Create an interactive virtual representation of a college campus that allows users to explore buildings, classrooms, laboratories, faculty locations, events, facilities, and campus resources through a **3D digital environment**.

An AI assistant will provide intelligent answers using real college data.

### 1.3 Problem Statement

Students and faculty often waste time finding:

- Classrooms
- Laboratories
- Faculty offices
- Available rooms
- Equipment
- Events
- Campus facilities

Existing college portals usually provide this information through disconnected pages, PDFs, notices, or static timetables.

There is no single interactive system connecting **physical campus spaces with digital information**.

### 1.4 Proposed Solution

The Digital Twin creates a centralized virtual campus where every important physical entity is digitally represented.

Example:

```text
3D Building
     ↓
Floor
     ↓
Room
     ↓
Timetable
     ↓
Availability
     ↓
Faculty
     ↓
Equipment
     ↓
Events

An AI assistant allows users to access this information using natural language.

2. Goals

The system should:

Create an interactive 3D representation of the college.
Allow users to explore campus buildings and rooms.
Display classroom schedules and availability.
Display faculty information and availability.
Track laboratory equipment.
Display campus events at their physical locations.
Provide campus navigation.
Provide an AI-powered campus assistant.
Provide an administrative dashboard.
Maintain campus information through a centralized database.
3. Non-Goals

The first version will not attempt to:

Create a highly realistic architectural simulation.
Control physical campus infrastructure.
Integrate directly with IoT hardware.
Provide GPS-level indoor positioning.
Replace the college ERP.
Provide biometric attendance.
Manage college finances.

These can be added as future extensions.

4. Target Users
4.1 Students

Students are the primary users.

They can:

Find classrooms.
Check schedules.
Find faculty.
Find available rooms.
Locate laboratories.
Check equipment.
Discover events.
Navigate the campus.
Ask the AI assistant questions.
4.2 Faculty

Faculty members can:

View their schedules.
View room information.
View office locations.
Manage/view availability.
View events.
Check lab and equipment information.
4.3 Administrators

Administrators control the Digital Twin.

They can:

Manage buildings.
Manage rooms.
Manage faculty.
Manage timetables.
Manage laboratories.
Manage equipment.
Manage events.
Manage campus information.
5. Core Features
F01 — Landing Page

The landing page introduces the Digital Twin.

Requirements
College branding.
Product introduction.
Interactive 3D preview.
Campus statistics.
Login/Register.
Enter Campus button.
AI assistant preview.
Primary CTA
ENTER DIGITAL CAMPUS
6. User Authentication

Users can log in according to their role.

Roles
Student
Faculty
Admin
Requirements
Login.
Registration where applicable.
JWT authentication.
Role-based access control.
Logout.
Protected routes.
7. Student Dashboard

After login, students see a personalized dashboard.

Dashboard Components
Welcome Message

Next Class
Upcoming Event
Available Labs
Quick Actions
Campus Activity
AI Assistant
Quick Actions
Explore Campus
Find Classroom
Find Faculty
Find Lab
Events
Navigation
Ask AI
8. 3D Digital Campus

This is the primary differentiating feature.

Users can interact with a 3D representation of the college campus.

Supported Interactions
Rotate.
Zoom.
Pan.
Click buildings.
Select buildings.
View building information.
Enter buildings.
Select floors.
Select rooms.
Technology

Three.js / React Three Fiber

Building Information

Example:

IT Building

Floors: 4
Rooms: 32
Labs: 8
Faculty: 24

[ Explore Building ]
9. Building & Floor System

Each building contains multiple floors.

Example:

IT Building
│
├── Ground Floor
├── First Floor
├── Second Floor
└── Third Floor
Floor Information

Each floor can contain:

Rooms.
Laboratories.
Faculty offices.
Facilities.
Availability information.
10. Classroom Information

Clicking a classroom opens its information panel.

Example:

Room A-204

Capacity: 60
Type: Classroom
Building: IT Block
Floor: 2

Status:
Available

Today's Schedule

09:00 – Data Structures
10:00 – Operating Systems
11:00 – Available
12:00 – Lunch
Requirements
Room details.
Capacity.
Current status.
Timetable.
Upcoming classes.
Location.
Navigation button.
11. Smart Room Finder

Users can search for available classrooms.

Input
Capacity
Duration
Preferred Building
Required Time
Example Result
A-105

Capacity: 50
Available: 2 PM – 4 PM
Distance: 150m

[ View Room ]
[ Navigate ]
System Logic

The system checks:

Room Capacity
      +
Timetable
      +
Requested Time
      +
Room Status

and returns matching rooms.

12. Faculty Directory

Users can search faculty members.

Faculty Information
Name.
Department.
Designation.
Office.
Schedule.
Availability.
Office hours.
Example
Dr. Rahul Sharma

Department:
Information Technology

Office:
IT Block – 302

Current Status:
Available

Next Available:
11:00 AM
Actions
View Profile.
Locate Office.
View Schedule.
13. Laboratory Management

Each laboratory has a digital representation.

Laboratory Information
Lab name.
Location.
Capacity.
Current status.
Timetable.
Equipment.

Example:

AI/ML Laboratory

Capacity: 40
Status: Available

Equipment:

GPU Workstations: 8/12
Raspberry Pi: 6/10
Arduino: 14/20
VR Headset: 2/5
14. Equipment Availability

Users can search for specific equipment.

Example Query
Raspberry Pi
Example Result
AI/ML Lab
Available: 6

Electronics Lab
Available: 2
Equipment Fields
Equipment name.
Quantity.
Available quantity.
Laboratory.
Condition.
Availability status.
15. Events Module

The system displays college events.

Event Information
Event name.
Date.
Time.
Location.
Description.
Organizer.
Capacity.
Registration status.
3D Integration

The event location is highlighted on the Digital Twin.

Example:

TECHFEST 2026

Location: Auditorium
Time: 10:00 AM

[ View on Campus ]
16. Campus Navigation

Users can navigate between campus locations.

Example:

Current Location
      ↓
Main Gate
      ↓
IT Building
      ↓
2nd Floor
      ↓
Room A-204
Navigation Information
Route.
Distance.
Estimated walking time.
Destination.
MVP Approach

Use predefined campus navigation nodes instead of real-time GPS.

17. AI Campus Assistant

The AI assistant provides natural-language access to campus information.

Example Queries
Query 1

Where is my next class?

Response:

Your next class is Operating Systems in A-204 at 10:00 AM.

Query 2

Find an empty classroom for 50 students.

Response:

A-105 is available from 2 PM to 4 PM and can accommodate 50 students.

Query 3

Where is the robotics workshop?

Response:

The Robotics Workshop is taking place in the Innovation Lab at 2 PM.

AI Capabilities

The assistant should understand:

Rooms.
Buildings.
Faculty.
Timetables.
Events.
Laboratories.
Equipment.
Facilities.
Navigation.
Important Requirement

The AI must answer using college database information and should not invent campus information.

18. Admin Dashboard

The admin dashboard manages the complete Digital Twin.

Dashboard Statistics
Buildings: 12
Rooms: 128
Faculty: 186
Labs: 32
Events: 14
Equipment: 1,250
18.1 Building Management

Admin can:

Add building.
Edit building.
Delete building.
View building.
18.2 Room Management

Admin can:

Add room.
Edit room.
Delete room.
Change availability.
Update capacity.
Assign timetable.
18.3 Faculty Management

Admin can:

Add faculty.
Edit faculty.
Delete faculty.
Assign office.
Manage schedule.
18.4 Laboratory Management

Admin can:

Add lab.
Edit lab.
Delete lab.
Manage availability.
18.5 Equipment Management

Admin can:

Add equipment.
Update quantity.
Update condition.
Change availability.
18.6 Event Management

Admin can:

Create event.
Edit event.
Delete event.
Assign location.
Update event status.
19. Campus Activity Layer

The Digital Twin should display what is currently happening around campus.

Example:

🔴 Auditorium
Tech Talk

🟡 Innovation Lab
Robotics Workshop

🟢 Library
Low Occupancy

🔵 Sports Ground
Football Practice

This makes the Digital Twin feel like a live representation of the campus rather than a static 3D model.

20. Database Design

The primary MongoDB collections will be:

Users
Buildings
Floors
Rooms
Faculty
Timetables
Labs
Equipment
Events
Facilities
NavigationNodes
Notifications
Example Room Document
{
  roomId: "A-204",
  buildingId: "...",
  floor: 2,
  capacity: 60,
  type: "classroom",
  status: "available"
}
Example Equipment Document
{
  name: "Raspberry Pi",
  labId: "...",
  totalQuantity: 10,
  availableQuantity: 6,
  condition: "good"
}
21. Technology Stack
Layer	Technology
Frontend	React.js
3D	Three.js / React Three Fiber
Styling	Tailwind CSS
Animation	Framer Motion
Backend	Node.js
API	Express.js
Database	MongoDB
Authentication	JWT
AI	LLM API + RAG
Deployment	Vercel + Render
Database Hosting	MongoDB Atlas
22. System Architecture
                         USER
                           │
                           ▼
                  React Frontend
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      3D Campus        Dashboard        AI Chat
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                     Express API
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
       MongoDB           AI/RAG       Navigation
          │                │                │
          └────────────────┼────────────────┘
                           │
                           ▼
                      CAMPUS DATA
23. API Requirements
Authentication
POST /api/auth/login
POST /api/auth/register
Buildings
GET    /api/buildings
GET    /api/buildings/:id
POST   /api/buildings
PUT    /api/buildings/:id
DELETE /api/buildings/:id
Rooms
GET /api/rooms
GET /api/rooms/:id
GET /api/rooms/available
Faculty
GET /api/faculty
GET /api/faculty/:id
GET /api/faculty/:id/availability
Labs
GET /api/labs
GET /api/labs/:id
Equipment
GET /api/equipment
GET /api/equipment/available
Events
GET    /api/events
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id
AI
POST /api/ai/chat
24. Non-Functional Requirements
Performance
Main pages should load quickly.
3D scenes should remain responsive.
API responses should generally be under 1–2 seconds.
Heavy 3D assets should be lazy-loaded.
Security
JWT authentication.
Password hashing.
Role-based authorization.
Protected admin APIs.
Input validation.
Secure API endpoints.
Responsiveness

The website should work on:

Desktop.
Laptop.
Tablet.
Mobile.

The desktop experience will be the primary target because of the 3D campus interface.

25. MVP Scope
Must Have 🔴
Login.
Student dashboard.
3D campus.
Clickable buildings.
Floors.
Rooms.
Timetable.
Room availability.
Faculty directory.
Laboratories.
Events.
AI assistant.
Admin dashboard.
MongoDB integration.
Should Have 🟡
Campus navigation.
Equipment tracking.
Campus activity layer.
Animations.
Notifications.
Future Features 🟢
IoT integration.
Real-time occupancy sensors.
AR campus navigation.
Digital attendance.
Energy monitoring.
Predictive analytics.
Smart building control.
26. Success Criteria

The project will be considered successful when a student can complete the following workflow:

LOGIN
  ↓
OPEN DIGITAL CAMPUS
  ↓
SELECT BUILDING
  ↓
SELECT FLOOR
  ↓
SELECT ROOM
  ↓
VIEW TIMETABLE
  ↓
CHECK AVAILABILITY
  ↓
FIND AVAILABLE ROOM
  ↓
NAVIGATE TO ROOM
  ↓
ASK AI ABOUT CAMPUS

An administrator should be able to:

LOGIN
  ↓
UPDATE ROOM
  ↓
UPDATE TIMETABLE
  ↓
UPDATE FACULTY
  ↓
UPDATE EQUIPMENT
  ↓
CREATE EVENT
  ↓
DATABASE UPDATED
  ↓
DIGITAL TWIN REFLECTS CHANGES
27. Key Differentiator

The project should not be positioned as a simple 3D college website.

The core positioning is:

A living digital replica of the college that connects physical spaces, people, schedules, resources, and events into one intelligent campus.

28. Killer Demo Scenario

The strongest hackathon demonstration should be:

User

"Show me an empty classroom for 60 students available for the next two hours."

System
AI Assistant
     ↓
Search Campus Database
     ↓
Check Room Capacity
     ↓
Check Timetable
     ↓
Check Availability
     ↓
Find Matching Room
     ↓
Highlight Room in 3D Campus
     ↓
Show Route
     ↓
Navigate User

This demonstrates that the project is not merely a 3D visualization, but a functional Digital Twin + Intelligent Campus Platform.

29. Development Phases
Phase 1 — Foundation
React setup.
Node/Express setup.
MongoDB setup.
Authentication.
Basic UI.
Project structure.
Phase 2 — Digital Twin
3D campus.
Buildings.
Floors.
Rooms.
Clickable objects.
Phase 3 — Campus Intelligence
Timetable.
Room availability.
Faculty.
Labs.
Equipment.
Events.
Phase 4 — Navigation
Navigation nodes.
Routes.
Distance.
Walking time.
Phase 5 — AI
AI chatbot.
Campus database integration.
RAG layer.
Natural-language queries.
Phase 6 — Admin
Admin dashboard.
CRUD operations.
Data management.
Role-based permissions.
Phase 7 — Final Polish
Animations.
Responsive design.
Loading states.
Error handling.
Notifications.
Demo data.
Deployment.
Final testing.
30. Final Product Flow
                    DIGITAL TWIN
                         │
                         ▼
                       LOGIN
                         │
             ┌───────────┴───────────┐
             │                       │
          STUDENT                  ADMIN
             │                       │
             ▼                       ▼
        DASHBOARD              ADMIN DASHBOARD
             │                       │
             ▼                       ▼
       3D CAMPUS               MANAGE CAMPUS
             │                       │
      ┌──────┼──────┐                │
      ▼      ▼      ▼                │
   Rooms    Labs  Events             │
      │      │      │                │
      └──────┼──────┘                │
             ▼                       │
       CAMPUS DATA ◄─────────────────┘
             │
             ▼
       AI ASSISTANT
             │
             ▼
      SMART CAMPUS
31. Product Definition

Digital Twin of a College is a full-stack intelligent campus platform that combines:

3D visualization
Real-time campus information
Room management
Faculty availability
Laboratory management
Equipment tracking
Event mapping
Campus navigation
AI-powered assistance
Administrative control

The final system should make the college searchable, explorable, navigable, and intelligent through a single digital environment.