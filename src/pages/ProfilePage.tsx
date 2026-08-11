import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { User as UserIcon, Shield, Mail, LogOut, CheckCircle } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, loginAsDemo, logout } = useAuth();

  return (
    <div className="flex-1 bg-[#F4F5F7] p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 select-none font-sans">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 p-4 sm:p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
          <img src={user?.avatar} alt={user?.name} className="w-20 h-20 rounded-full object-cover border-2 border-slate-300" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-blue-100 text-blue-800">
                {user?.role.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-slate-400">{user?.studentId || 'FAC-2026-990'}</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] mt-1">{user?.name}</h1>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Switch Persona Mode</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => loginAsDemo('student')}
              className={`p-4 border text-left transition-all ${
                user?.role === 'student' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-bold text-[#1A1A1A]">Student Persona</div>
              <div className="text-[10px] text-slate-400">Alex Mercer</div>
            </button>

            <button
              onClick={() => loginAsDemo('faculty')}
              className={`p-4 border text-left transition-all ${
                user?.role === 'faculty' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-bold text-[#1A1A1A]">Faculty Persona</div>
              <div className="text-[10px] text-slate-400">Dr. Rahul Sharma</div>
            </button>

            <button
              onClick={() => loginAsDemo('admin')}
              className={`p-4 border text-left transition-all ${
                user?.role === 'admin' ? 'border-amber-600 bg-amber-50/50' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-bold text-amber-800">Admin Operations</div>
              <div className="text-[10px] text-slate-400">Campus Admin</div>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={logout}
            className="px-5 py-2.5 bg-red-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
