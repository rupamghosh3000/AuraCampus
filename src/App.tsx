import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CampusPage } from './pages/CampusPage';
import { RoomsPage } from './pages/RoomsPage';
import { FacultyPage } from './pages/FacultyPage';
import { LabsPage } from './pages/LabsPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { EventsPage } from './pages/EventsPage';
import { NavigationPage } from './pages/NavigationPage';
import { AssistantPage } from './pages/AssistantPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

import { NavigationPath } from './types';

const MainAppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('campus');
  const [targetBuildingId, setTargetBuildingId] = useState<string | null>('b-01');
  const [targetFloor, setTargetFloor] = useState<number | null>(1);
  const [targetRoomCode, setTargetRoomCode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  const [activePath, setActivePath] = useState<NavigationPath | null>(null);

  const handleNavigateTab = (tab: string, buildingId?: string, floor?: number, roomCode?: string) => {
    if (buildingId) {
      setTargetBuildingId(buildingId);
    }
    if (floor !== undefined) {
      setTargetFloor(floor);
    }
    if (roomCode !== undefined) {
      setTargetRoomCode(roomCode);
    }
    setActiveTab(tab);
  };

  const handleShowIn3D = (buildingId: string, floor?: number, roomCode?: string) => {
    setTargetBuildingId(buildingId);
    setTargetFloor(floor ?? 1);
    setTargetRoomCode(roomCode ?? null);
    setActiveTab('campus');
  };

  // If user is on public landing page or login page
  if (activeTab === 'landing') {
    return (
      <LandingPage
        onEnterCampus={() => setActiveTab('dashboard')}
        onGoLogin={() => setActiveTab('login')}
      />
    );
  }

  if (activeTab === 'login') {
    return <LoginPage onSuccess={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F4F5F7] font-sans text-[#1A1A1A]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearchQuery={(q) => {
          if (q) {
            setActiveTab('rooms');
          }
        }}
      />

      {/* Main Workspace Stage */}
      <div className="flex-1 flex overflow-hidden relative">
        {activeTab === 'dashboard' && <DashboardPage onNavigateTab={handleNavigateTab} />}
        {activeTab === 'campus' && (
          <CampusPage
            initialBuildingId={targetBuildingId}
            initialFloor={targetFloor}
            initialRoomCode={targetRoomCode}
            initialPath={activePath}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onNavigateToTab={handleNavigateTab}
          />
        )}
        {activeTab === 'rooms' && <RoomsPage onShowIn3D={handleShowIn3D} />}
        {activeTab === 'faculty' && <FacultyPage onShowIn3D={handleShowIn3D} />}
        {activeTab === 'labs' && <LabsPage onShowIn3D={handleShowIn3D} />}
        {activeTab === 'equipment' && <EquipmentPage />}
        {activeTab === 'events' && <EventsPage onShowIn3D={handleShowIn3D} />}
        {activeTab === 'navigation' && (
          <NavigationPage
            onLaunchIn3D={(path) => {
              setActivePath(path);
              setActiveTab('campus');
            }}
          />
        )}
        {activeTab === 'assistant' && <AssistantPage onShowIn3D={handleShowIn3D} />}
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'admin' && <AdminPage />}
      </div>

      {/* Bottom Telemetry Status Bar */}
      <Footer
        selectedFloor={targetFloor}
        onSelectFloor={(f) => setTargetFloor(f)}
        viewMode={viewMode}
        setViewMode={(m) => setViewMode(m)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
