import React, { useState } from 'react';
import { Search, User as UserIcon, Bell, Layers, LogOut, ShieldAlert, LogIn, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface HeaderProps {
  onSearchQuery?: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchQuery, activeTab, setActiveTab }) => {
  const { user, studentPresets, loginAsStudentPreset, loginAsDemo, logout, isAdmin, isFaculty } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearchQuery) {
      onSearchQuery(val);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'campus', label: '3D Twin' },
    { id: 'rooms', label: 'Smart Rooms' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'labs', label: 'Labs & Tech' },
    { id: 'events', label: 'Events' },
    { id: 'assistant', label: 'Copilot', isCopilot: true },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Ops', isAdmin: true }] : []),
  ];

  return (
    <header className="bg-white border-b border-slate-200 z-50 shadow-2xs relative">
      <div className="flex items-center justify-between px-3 sm:px-5 py-2 whitespace-nowrap">
        {/* Brand & Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-600 hover:text-[#1A1A1A] lg:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setActiveTab('campus')}
            className="flex items-center gap-2 group cursor-pointer text-left shrink-0"
          >
            <div className="w-7 h-7 bg-[#1A1A1A] flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <div className="w-3.5 h-3.5 border-t-2 border-r-2 border-white rotate-45"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-sm uppercase text-[#1A1A1A] whitespace-nowrap">
                Aura <span className="font-light text-slate-500">Campus</span>
              </span>
              <span className="text-[9.5px] font-mono uppercase tracking-widest text-blue-600 font-bold whitespace-nowrap">Digital Twin</span>
            </div>
          </button>

          {/* Global Search Input (Tablet/Desktop) */}
          <div className="relative hidden md:block shrink-0">
            <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search buildings, rooms, faculty..."
              className="pl-8 pr-3 py-1 w-48 xl:w-64 bg-slate-100 border border-transparent focus:border-slate-300 focus:bg-white text-xs outline-none transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Center Navigation Links - Desktop Single Line */}
        <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap shrink-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`pb-0.5 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === item.id
                  ? item.isCopilot
                    ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                    : item.isAdmin
                    ? 'text-amber-600 border-b-2 border-amber-600 font-bold'
                    : 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-bold'
                  : item.isCopilot
                  ? 'hover:text-blue-600'
                  : item.isAdmin
                  ? 'text-amber-600 font-bold hover:text-amber-700'
                  : 'hover:text-[#1A1A1A]'
              }`}
            >
              {item.isCopilot && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse shrink-0"></div>}
              {item.isAdmin && <ShieldAlert className="w-3.5 h-3.5 shrink-0" />}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Controls & Login Account Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Student & Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold uppercase tracking-wider text-slate-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span className="text-[10px] text-slate-500 uppercase font-mono hidden sm:inline">User:</span>
              <span className="font-bold text-[#1A1A1A] truncate max-w-[85px] sm:max-w-[120px]">{user?.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-300 shadow-2xl p-2 z-50 space-y-1">
                <div className="text-[10px] uppercase font-mono font-bold text-slate-400 px-2 py-1">
                  Select Student Profile
                </div>
                {studentPresets.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      loginAsStudentPreset(s.id);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 text-xs font-semibold hover:bg-slate-100 flex items-center justify-between cursor-pointer ${
                      user?.id === s.id ? 'text-blue-600 font-bold bg-blue-50 border-l-2 border-blue-600' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={s.avatar} alt={s.name} className="w-5 h-5 rounded-full object-cover" />
                      <span>{s.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{s.studentId}</span>
                  </button>
                ))}

                <div className="border-t border-slate-200 my-1 pt-1">
                  <div className="text-[10px] uppercase font-mono font-bold text-slate-400 px-2 py-1">Other Personas</div>
                  <button
                    onClick={() => {
                      loginAsDemo('faculty');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-100 flex items-center justify-between cursor-pointer ${
                      user?.role === 'faculty' ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Faculty (Dr. Sharma)</span>
                  </button>
                  <button
                    onClick={() => {
                      loginAsDemo('admin');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-100 flex items-center justify-between cursor-pointer ${
                      user?.role === 'admin' ? 'text-amber-600 font-bold bg-amber-50' : 'text-slate-700'
                    }`}
                  >
                    <span>Admin Operations</span>
                  </button>
                </div>

                <div className="border-t border-slate-200 pt-1">
                  <button
                    onClick={() => {
                      setActiveTab('login');
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Open Full Login Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <button
            onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300 hover:border-[#1A1A1A] transition-all cursor-pointer shrink-0"
            title="View User Profile"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name || 'User'} className="w-full h-full object-cover" />
            ) : (
              <div className="text-xs font-bold text-slate-800">{(user?.name || 'AU').substring(0, 2).toUpperCase()}</div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-3 shadow-lg">
          <div className="relative md:hidden">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search buildings, rooms..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-100 border border-slate-200 text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-2 text-left border flex items-center gap-2 cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.isCopilot && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
