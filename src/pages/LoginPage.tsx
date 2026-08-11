import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ArrowRight, UserCheck, Calendar, ShieldCheck, BookOpen } from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, loginAsStudentPreset, loginAsDemo, studentPresets } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email, role);
      onSuccess();
    }
  };

  const handleStudentSelect = (studentId: string) => {
    loginAsStudentPreset(studentId);
    onSuccess();
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    loginAsDemo(demoRole);
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#1A1A1A] flex items-center justify-center p-6 select-none font-sans">
      <div className="bg-white border border-slate-300 w-full max-w-4xl shadow-2xl p-8 space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#1A1A1A] mx-auto flex items-center justify-center">
            <div className="w-6 h-6 border-t-2 border-r-2 border-white rotate-45"></div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A] uppercase">
            Aura <span className="font-light text-slate-500">Campus</span>
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Student & Faculty Portal — Sign in to view your personalized schedule & 3D navigation
          </p>
        </div>

        {/* Student Schedule Login Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Select Student Account (Personalized Schedule)
            </span>
            <span className="text-xs text-slate-500">4 Enrolled Students Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentPresets.map((s) => (
              <button
                key={s.id}
                onClick={() => handleStudentSelect(s.id)}
                className="p-4 bg-slate-50 border border-slate-200 hover:border-blue-600 hover:bg-blue-50/40 text-left transition-all cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-full object-cover border border-slate-300" />
                  <div>
                    <div className="text-sm font-bold text-[#1A1A1A] group-hover:text-blue-600 flex items-center gap-2">
                      <span>{s.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-200 text-slate-700 font-semibold">
                        {s.studentId}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">{s.department}</div>
                  </div>
                </div>

                {/* Schedule Preview */}
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Schedule Preview ({s.schedule?.length || 0} classes)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                  {s.schedule?.slice(0, 2).map((item) => (
                    <div key={item.id} className="text-xs flex items-center justify-between text-slate-700">
                      <span className="font-semibold truncate max-w-[200px]">{item.courseName}</span>
                      <span className="font-mono text-[11px] text-blue-600 font-bold">{item.roomCode}</span>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Other Persona Roles & Custom Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
          {/* Quick Faculty/Admin Switch */}
          <div className="p-4 bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 block">
              Faculty & Admin Quick Login
            </span>
            <button
              onClick={() => handleQuickDemo('faculty')}
              className="w-full p-3 bg-white border border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-sm font-bold text-slate-800">Faculty Portal (Dr. Rahul Sharma)</div>
                <div className="text-xs font-mono text-slate-500">faculty@demo.com</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </button>

            <button
              onClick={() => handleQuickDemo('admin')}
              className="w-full p-3 bg-white border border-slate-200 hover:border-amber-600 hover:bg-amber-50/50 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-sm font-bold text-amber-900">Admin Operations Portal</div>
                <div className="text-xs font-mono text-slate-500">admin@demo.com</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
            </button>
          </div>

          {/* Custom Student / Email Sign-In */}
          <form onSubmit={handleSubmit} className="p-4 bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 block">
              Custom Student Sign In
            </span>
            <div>
              <label className="block text-xs uppercase font-bold text-slate-600 mb-1">College Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. your.name@college.edu"
                className="w-full px-3 py-2 bg-white border border-slate-200 text-xs focus:border-[#1A1A1A] outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-600 mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-white border border-slate-200 text-xs focus:border-[#1A1A1A] outline-none font-medium uppercase font-mono"
              >
                <option value="student">Student Account</option>
                <option value="faculty">Faculty Member</option>
                <option value="admin">Admin Operations</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all cursor-pointer"
            >
              Access Digital Campus
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
