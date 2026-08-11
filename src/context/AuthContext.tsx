import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, ClassScheduleItem } from '../types';

interface AuthContextType {
  user: User | null;
  studentPresets: User[];
  login: (email: string, role?: UserRole) => boolean;
  loginAsStudentPreset: (studentId: string) => void;
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isFaculty: boolean;
  isStudent: boolean;
}

// Preset Students with distinct schedules
const PRESET_STUDENTS: User[] = [
  {
    id: 'usr-student-01',
    name: 'Alex Mercer',
    email: 'alex.mercer@college.edu',
    role: 'student',
    studentId: 'CS-2024-8891',
    department: 'Computer Science & AI',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    schedule: [
      {
        id: 'sch-01',
        time: '09:00 AM – 10:30 AM',
        courseCode: 'CS301',
        courseName: 'Data Structures & Algorithms',
        buildingId: 'b-01',
        buildingName: 'Science & Innovation Hub',
        roomCode: 'A-204',
        floor: 2,
        instructor: 'Dr. Rahul Sharma',
        status: 'In Progress',
      },
      {
        id: 'sch-02',
        time: '11:00 AM – 12:30 PM',
        courseCode: 'CS405',
        courseName: 'AI & Machine Learning Lab',
        buildingId: 'b-02',
        buildingName: 'Computer Engineering Block',
        roomCode: 'B-101',
        floor: 1,
        instructor: 'Prof. Ananya Roy',
        status: 'Upcoming',
      },
      {
        id: 'sch-03',
        time: '02:00 PM – 03:30 PM',
        courseCode: 'CS304',
        courseName: 'Operating Systems & Networks',
        buildingId: 'b-03',
        buildingName: 'Design & Media Annex',
        roomCode: 'C-102',
        floor: 1,
        instructor: 'Dr. Vikram Seth',
        status: 'Upcoming',
      },
    ],
  },
  {
    id: 'usr-student-02',
    name: 'Sophia Chen',
    email: 'sophia.chen@college.edu',
    role: 'student',
    studentId: 'RO-2024-4412',
    department: 'Robotics & Automation',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    schedule: [
      {
        id: 'sch-04',
        time: '10:00 AM – 11:30 AM',
        courseCode: 'RO202',
        courseName: 'Autonomous Mobile Robotics',
        buildingId: 'b-07',
        buildingName: 'Robotics & Mechatronics Lab',
        roomCode: 'G-101',
        floor: 1,
        instructor: 'Dr. Rahul Sharma',
        status: 'In Progress',
      },
      {
        id: 'sch-05',
        time: '12:00 PM – 01:30 PM',
        courseCode: 'RO305',
        courseName: 'Microcontrollers & Embedded C',
        buildingId: 'b-07',
        buildingName: 'Robotics & Mechatronics Lab',
        roomCode: 'G-102',
        floor: 1,
        instructor: 'Prof. Kabir Mehta',
        status: 'Upcoming',
      },
      {
        id: 'sch-06',
        time: '03:00 PM – 04:30 PM',
        courseCode: 'RO410',
        courseName: 'Kinematics & Control Systems',
        buildingId: 'b-04',
        buildingName: 'Central Library & Learning Center',
        roomCode: 'D-101',
        floor: 1,
        instructor: 'Dr. Elena Vance',
        status: 'Upcoming',
      },
    ],
  },
  {
    id: 'usr-student-03',
    name: 'Rupam Ghosh',
    email: 'rupam.ghosh@college.edu',
    role: 'student',
    studentId: 'IT-2024-9902',
    department: 'Information Technology & Cloud',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    schedule: [
      {
        id: 'sch-07',
        time: '09:30 AM – 11:00 AM',
        courseCode: 'IT401',
        courseName: 'Cloud Native Architecture & Kubernetes',
        buildingId: 'b-02',
        buildingName: 'Computer Engineering Block',
        roomCode: 'B-301',
        floor: 3,
        instructor: 'Prof. Neha Gupta',
        status: 'In Progress',
      },
      {
        id: 'sch-08',
        time: '11:30 AM – 01:00 PM',
        courseCode: 'IT302',
        courseName: 'Advanced Distributed Databases',
        buildingId: 'b-04',
        buildingName: 'Central Library & Learning Center',
        roomCode: 'D-201',
        floor: 2,
        instructor: 'Dr. Vikram Seth',
        status: 'Upcoming',
      },
      {
        id: 'sch-09',
        time: '02:30 PM – 04:00 PM',
        courseCode: 'IT408',
        courseName: 'Cybersecurity & Cryptography',
        buildingId: 'b-02',
        buildingName: 'Computer Engineering Block',
        roomCode: 'B-101',
        floor: 1,
        instructor: 'Dr. Rahul Sharma',
        status: 'Upcoming',
      },
    ],
  },
  {
    id: 'usr-student-04',
    name: 'Maya Patel',
    email: 'maya.patel@college.edu',
    role: 'student',
    studentId: 'EE-2024-3321',
    department: 'Electrical & Hardware Engineering',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
    schedule: [
      {
        id: 'sch-10',
        time: '08:30 AM – 10:00 AM',
        courseCode: 'EE301',
        courseName: 'Digital Signal Processing',
        buildingId: 'b-02',
        buildingName: 'Computer Engineering Block',
        roomCode: 'B-202',
        floor: 2,
        instructor: 'Dr. Elena Vance',
        status: 'Completed',
      },
      {
        id: 'sch-11',
        time: '10:30 AM – 12:00 PM',
        courseCode: 'EE405',
        courseName: 'VLSI Silicon Circuit Design',
        buildingId: 'b-07',
        buildingName: 'Robotics & Mechatronics Lab',
        roomCode: 'G-201',
        floor: 2,
        instructor: 'Prof. Kabir Mehta',
        status: 'In Progress',
      },
      {
        id: 'sch-12',
        time: '01:30 PM – 03:00 PM',
        courseCode: 'EE412',
        courseName: 'Neural Hardware Accelerator Design',
        buildingId: 'b-01',
        buildingName: 'Science & Innovation Hub',
        roomCode: 'A-301',
        floor: 3,
        instructor: 'Dr. Rahul Sharma',
        status: 'Upcoming',
      },
    ],
  },
];

const DEMO_USERS: Record<UserRole, User> = {
  student: PRESET_STUDENTS[0],
  faculty: {
    id: 'usr-faculty-01',
    name: 'Dr. Rahul Sharma',
    email: 'faculty@demo.com',
    role: 'faculty',
    department: 'Computer Science & AI',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  },
  admin: {
    id: 'usr-admin-01',
    name: 'Campus Ops Admin',
    email: 'admin@demo.com',
    role: 'admin',
    department: 'Infrastructure & Operations',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('aura_campus_user');
      return saved ? JSON.parse(saved) : PRESET_STUDENTS[0];
    } catch (e) {
      console.warn('Failed to parse saved user from localStorage', e);
      return PRESET_STUDENTS[0];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('aura_campus_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aura_campus_user');
    }
  }, [user]);

  const login = (email: string, role: UserRole = 'student'): boolean => {
    const emailLower = email.toLowerCase().trim();
    if (emailLower.includes('admin')) {
      setUser(DEMO_USERS.admin);
      return true;
    }
    if (emailLower.includes('faculty')) {
      setUser(DEMO_USERS.faculty);
      return true;
    }

    // Check if email matches one of the preset students
    const matchedPreset = PRESET_STUDENTS.find(
      (s) => s.email.toLowerCase() === emailLower || s.name.toLowerCase().includes(emailLower.split('@')[0])
    );

    if (matchedPreset) {
      setUser(matchedPreset);
      return true;
    }

    // Generate custom student profile with distinct schedule
    const namePart = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim();
    const formattedName = namePart ? namePart.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Student User';
    const studentIdNum = Math.floor(1000 + Math.random() * 9000);

    const customStudent: User = {
      id: `usr-custom-${Date.now()}`,
      name: formattedName,
      email: email,
      role: 'student',
      studentId: `ST-2024-${studentIdNum}`,
      department: 'Digital Systems Engineering',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
      schedule: [
        {
          id: `sch-dyn-1`,
          time: '09:00 AM – 10:30 AM',
          courseCode: 'SE302',
          courseName: 'Software Engineering Architecture',
          buildingId: 'b-02',
          buildingName: 'Computer Engineering Block',
          roomCode: 'B-201',
          floor: 2,
          instructor: 'Dr. Rahul Sharma',
          status: 'In Progress',
        },
        {
          id: `sch-dyn-2`,
          time: '11:00 AM – 12:30 PM',
          courseCode: 'CS410',
          courseName: 'Digital Signal & Image Processing',
          buildingId: 'b-01',
          buildingName: 'Science & Innovation Hub',
          roomCode: 'A-204',
          floor: 2,
          instructor: 'Prof. Ananya Roy',
          status: 'Upcoming',
        },
        {
          id: `sch-dyn-3`,
          time: '02:00 PM – 03:30 PM',
          courseCode: 'IT305',
          courseName: 'High Performance Computing Lab',
          buildingId: 'b-04',
          buildingName: 'Central Library & Learning Center',
          roomCode: 'D-201',
          floor: 2,
          instructor: 'Dr. Vikram Seth',
          status: 'Upcoming',
        },
      ],
    };

    setUser(customStudent);
    return true;
  };

  const loginAsStudentPreset = (studentId: string) => {
    const preset = PRESET_STUDENTS.find((s) => s.id === studentId || s.studentId === studentId);
    if (preset) {
      setUser(preset);
    }
  };

  const loginAsDemo = (role: UserRole) => {
    setUser(DEMO_USERS[role]);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        studentPresets: PRESET_STUDENTS,
        login,
        loginAsStudentPreset,
        loginAsDemo,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isFaculty: user?.role === 'faculty',
        isStudent: user?.role === 'student',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
