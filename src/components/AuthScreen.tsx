import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Shield,
  KeyRound,
  CheckCircle2,
  Lock,
  User,
  GraduationCap,
  Globe2,
  MessageCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthScreen: React.FC = () => {
  const { loginWithGoogle, loginAsAdmin, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'student' | 'admin'>('student');
  const [adminUsername, setAdminUsername] = useState('admin123');
  const [adminPassword, setAdminPassword] = useState('12345');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Gagal login dengan akun Google. Pastikan popup tidak diblokir.'
      );
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const result = await loginAsAdmin(adminUsername, adminPassword);
      if (!result.success) {
        setErrorMsg(result.message);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Login admin gagal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillAdminCredentials = () => {
    setAdminUsername('admin123');
    setAdminPassword('12345');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Arabic geometric background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center select-none overflow-hidden">
        <span className="text-[28rem] font-arabic leading-none text-emerald-400">
          العربية
        </span>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-900 shadow-xl shadow-emerald-500/25 mb-4 text-3xl font-bold font-arabic">
            ف
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-tajawal">
            Al-Fusha LMS
          </h1>
          <p className="mt-1 text-sm font-arabic text-emerald-300 text-lg">
            مَرْكَزُ تَعَلُّمِ اللُّغَةِ الْعَرَبِيَّةِ وَقَوَاعِدِهَا
          </p>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
            Sistem Pembelajaran Bahasa Arab Terpadu dengan AI I'rab, Shorof, Muhadatsah, dan Evaluasi Interaktif.
          </p>
        </div>

        {/* Auth Box */}
        <div className="mt-8 bg-white/95 backdrop-blur-md py-8 px-4 sm:px-10 shadow-2xl rounded-2xl text-slate-900 border border-emerald-500/30">
          
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('student');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                authMode === 'student'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Login Siswa (Google)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('admin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                authMode === 'admin'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Login Admin</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Student / Google Sign-In Tab */}
          {authMode === 'student' && (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-base font-bold text-slate-800">
                  Masuk sebagai Pelajar
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Masuk menggunakan akun Google Anda untuk menyimpan progress belajar, perolehan XP, dan kosakata di cloud.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-300 rounded-xl shadow-xs bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {/* Google colorful G logo */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{isLoading ? 'Menghubungkan...' : 'Lanjutkan dengan Google'}</span>
              </button>

              <div className="pt-3 border-t border-slate-100">
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Progress otomatis tersimpan per-user di Firebase Firestore</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Akses latihan Nahwu, Shorof, & Muhadatsah AI Gemini</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Tab */}
          {authMode === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="text-center">
                <div className="inline-flex p-2 rounded-lg bg-purple-100 text-purple-700 mb-2">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-slate-800">
                  Login Panel Administrator
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gunakan kredensial admin yang telah ditentukan
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center justify-between">
                <span>Default: <b>admin123</b> / <b>12345</b></span>
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="px-2 py-0.5 text-[10px] bg-amber-200 hover:bg-amber-300 rounded font-semibold text-amber-900 transition-colors"
                >
                  Isi Otomatis
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username Admin
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="admin123"
                    className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="12345"
                    className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md shadow-purple-600/20 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Memverifikasi...' : 'Masuk sebagai Admin'}
              </button>
            </form>
          )}
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 text-xs text-slate-300 max-w-md mx-auto">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Kitab Ajurrumiyyah</p>
              <p className="text-[11px] text-slate-400">Nahwu & Shorof sistematis</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Asisten I'rab AI</p>
              <p className="text-[11px] text-slate-400">Bedah kalimat otomatis</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-2.5">
            <MessageCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Muhadatsah AI</p>
              <p className="text-[11px] text-slate-400">Partner dialog Arab fusha</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-2.5">
            <Globe2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Audio & Kuis</p>
              <p className="text-[11px] text-slate-400">Pronunciation & Gamifikasi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
