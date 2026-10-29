import React from 'react';
import {
  BookOpen,
  Sparkles,
  MessageSquare,
  BookmarkCheck,
  BarChart3,
  Shield,
  LogOut,
  Flame,
  Award,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type ActiveTab = 'courses' | 'ai-tutor' | 'muhadatsah' | 'mufradat' | 'progress' | 'admin';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { userProfile, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('courses')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20 text-xl font-arabic">
              ف
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
                  Al-Fusha LMS
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 font-arabic">
                  مَرْكَزُ اللُّغَةِ
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Platform Pembelajaran Bahasa Arab Terpadu
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'courses'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Materi Kursus</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-tutor')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'ai-tutor'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Asisten I'rab AI</span>
            </button>

            <button
              onClick={() => setActiveTab('muhadatsah')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'muhadatsah'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <span>Muhadatsah AI</span>
            </button>

            <button
              onClick={() => setActiveTab('mufradat')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'mufradat'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-indigo-500" />
              <span>Bank Mufradat</span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'progress'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span>Progress Belajar</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <Shield className="w-4 h-4 text-purple-600" />
                <span>Panel Admin</span>
              </button>
            )}
          </nav>

          {/* User profile & Logout button */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Gamification badges */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold" title="Total XP Belajar">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>{userProfile?.xp || 0} XP</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold" title="Streak Hari Belajar">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>{userProfile?.streak || 1} Hari</span>
              </div>
            </div>

            {/* Profile Avatar & Info */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt={userProfile.displayName}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-2 ring-emerald-500/20 object-cover"
                />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center">
                  {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="hidden xl:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                    {userProfile?.displayName || 'Pengguna'}
                  </span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.2 text-[10px] bg-purple-100 text-purple-800 rounded-sm font-bold">
                      ADMIN
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  {userProfile?.level || "Mubtadi'"}
                </p>
              </div>
            </div>

            {/* TOMBOL LOGOUT: Required prominently */}
            <button
              onClick={() => logout()}
              title="Keluar dari akun"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-200 shadow-2xs"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile bottom / secondary nav */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('courses')}
            className={`p-2 rounded-md ${activeTab === 'courses' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'}`}
          >
            Kursus
          </button>
          <button
            onClick={() => setActiveTab('ai-tutor')}
            className={`p-2 rounded-md ${activeTab === 'ai-tutor' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'}`}
          >
            I'rab AI
          </button>
          <button
            onClick={() => setActiveTab('muhadatsah')}
            className={`p-2 rounded-md ${activeTab === 'muhadatsah' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'}`}
          >
            Muhadatsah
          </button>
          <button
            onClick={() => setActiveTab('mufradat')}
            className={`p-2 rounded-md ${activeTab === 'mufradat' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'}`}
          >
            Mufradat
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`p-2 rounded-md ${activeTab === 'progress' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-600'}`}
          >
            Progress
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`p-2 rounded-md ${activeTab === 'admin' ? 'text-purple-700 font-bold bg-purple-50' : 'text-purple-600'}`}
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
