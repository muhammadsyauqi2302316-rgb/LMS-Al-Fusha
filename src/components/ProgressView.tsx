import React, { useEffect, useState } from 'react';
import {
  Award,
  Flame,
  CheckCircle2,
  BookOpen,
  BookmarkCheck,
  TrendingUp,
  GraduationCap,
  Star,
  Target
} from 'lucide-react';
import { Course, LessonProgress, VocabItem } from '../types/lms';
import { useAuth } from '../context/AuthContext';
import { getUserSavedVocabulary } from '../services/lmsService';

interface ProgressViewProps {
  courses: Course[];
  progressMap: Record<string, LessonProgress>;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ courses, progressMap }) => {
  const { userProfile } = useAuth();
  const [savedVocab, setSavedVocab] = useState<VocabItem[]>([]);

  useEffect(() => {
    if (userProfile) {
      getUserSavedVocabulary(userProfile.id)
        .then(setSavedVocab)
        .catch(console.error);
    }
  }, [userProfile]);

  // Aggregate stats
  let totalLessons = 0;
  courses.forEach((c) => {
    totalLessons += c.lessons.length;
  });

  const completedList = Object.values(progressMap).filter((p) => p.completed);
  const completedCount = completedList.length;
  const overallPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const totalScores = completedList.reduce((acc, curr) => acc + (curr.quizScore || 0), 0);
  const avgScore = completedCount > 0 ? Math.round(totalScores / completedCount) : 0;

  const badges = [
    {
      title: 'Kalam Mubtadi\'',
      desc: 'Memulai langkah pertama belajar bahasa Arab',
      unlocked: completedCount >= 1,
      icon: '🌱'
    },
    {
      title: 'Pakar Nahwu Dasar',
      desc: 'Menyelesaikan modul pengantar Al-Ajurrumiyyah',
      unlocked: Boolean(progressMap['nahwu-lesson-1']?.completed),
      icon: '📖'
    },
    {
      title: 'Kolektor Mufradat',
      desc: 'Menyimpan lebih dari 3 kosakata favorit',
      unlocked: savedVocab.length >= 3,
      icon: '⭐'
    },
    {
      title: 'Mutakallim Fusha',
      desc: 'Menuntaskan latihan percakapan Muhadatsah',
      unlocked: Boolean(progressMap['hiwar-lesson-1']?.completed),
      icon: '💬'
    },
    {
      title: 'Pelajar Mumtaz',
      desc: 'Mencapai skor kuis sempurna (100%)',
      unlocked: completedList.some((p) => (p.quizScore || 0) === 100),
      icon: '🏆'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Overview Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {userProfile?.photoURL ? (
            <img
              src={userProfile.photoURL}
              alt={userProfile.displayName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-emerald-500/20"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-2xl flex items-center justify-center font-arabic shadow-md">
              {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'ف'}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-tajawal">
                {userProfile?.displayName}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                {userProfile?.role === 'admin' ? 'Administrator' : 'Siswa Aktif'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{userProfile?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                Tingkat: <b className="text-emerald-700">{userProfile?.level || "Mubtadi'"}</b>
              </span>
            </div>
          </div>
        </div>

        {/* Gamification stats pill */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <Award className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <p className="text-xs text-amber-800 font-medium">Total XP</p>
            <p className="text-lg sm:text-xl font-bold text-amber-900">{userProfile?.xp || 0}</p>
          </div>
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-center">
            <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
            <p className="text-xs text-orange-800 font-medium">Streak</p>
            <p className="text-lg sm:text-xl font-bold text-orange-900">{userProfile?.streak || 1} Hari</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <Target className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs text-emerald-800 font-medium">Rata-rata Kuis</p>
            <p className="text-lg sm:text-xl font-bold text-emerald-900">{avgScore}%</p>
          </div>
        </div>
      </div>

      {/* Progress Bars per Course */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 font-tajawal flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Kemajuan Belajar per Modul</span>
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Total Selesai: {completedCount} dari {totalLessons} Bab ({overallPercentage}%)
          </span>
        </div>

        <div className="space-y-4 pt-2">
          {courses.map((course) => {
            const courseLessons = course.lessons;
            const completedInCourse = courseLessons.filter((l) => progressMap[l.id]?.completed).length;
            const percentage = courseLessons.length > 0 ? Math.round((completedInCourse / courseLessons.length) * 100) : 0;

            return (
              <div key={course.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span className="font-tajawal">{course.title}</span>
                  <span className="text-emerald-700">{completedInCourse} / {courseLessons.length} Bab ({percentage}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 font-tajawal flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Lencana & Prestasi (Badges)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {badges.map((b, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border text-center transition-all ${
                b.unlocked
                  ? 'bg-emerald-50/70 border-emerald-300 text-slate-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div className="text-3xl mb-1">{b.icon}</div>
              <p className="text-xs font-bold font-tajawal">{b.title}</p>
              <p className="text-[10px] mt-1 leading-tight">{b.desc}</p>
              {b.unlocked && (
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                  Terbuka
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
