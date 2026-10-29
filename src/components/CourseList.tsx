import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  MessageSquare,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';
import { Course, Lesson, LessonProgress } from '../types/lms';

interface CourseListProps {
  courses: Course[];
  progressMap: Record<string, LessonProgress>;
  onSelectLesson: (course: Course, lesson: Lesson) => void;
}

export const CourseList: React.FC<CourseListProps> = ({
  courses,
  progressMap,
  onSelectLesson
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(courses[0]?.id || null);

  const categories = ['Semua', 'Nahwu', 'Shorof', 'Muhadatsah', 'Mufradat'];

  const filteredCourses = selectedCategory === 'Semua'
    ? courses
    : courses.filter((c) => c.category === selectedCategory);

  const getCourseStats = (course: Course) => {
    const total = course.lessons.length;
    if (total === 0) return { total: 0, completed: 0, percent: 0 };
    const completed = course.lessons.filter((l) => progressMap[l.id]?.completed).length;
    const percent = Math.round((completed / total) * 100);
    return { total, completed, percent };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Nahwu': return <BookOpen className="w-5 h-5 text-emerald-600" />;
      case 'Shorof': return <Layers className="w-5 h-5 text-indigo-600" />;
      case 'Muhadatsah': return <MessageSquare className="w-5 h-5 text-teal-600" />;
      case 'Mufradat': return <Sparkles className="w-5 h-5 text-amber-500" />;
      default: return <BookOpen className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Kurikulum Standar Al-Ajurrumiyyah & Percakapan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-tajawal">
            Daftar Modul & Materi Bahasa Arab
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Pelajari kaidah Nahwu, Shorof, Kosakata tematik, serta latihan percakapan sehari-hari. Selesaikan modul untuk memperoleh XP dan sertifikat kompetensi.
          </p>
        </div>

        {/* Decorative Arabic Calligraphy overlay */}
        <div className="absolute right-4 -bottom-6 text-7xl sm:text-9xl font-arabic text-emerald-400/10 pointer-events-none select-none font-bold">
          العربية
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Courses Accordion / List */}
      <div className="space-y-4">
        {filteredCourses.map((course) => {
          const stats = getCourseStats(course);
          const isExpanded = expandedCourseId === course.id;

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all overflow-hidden"
            >
              {/* Course Header */}
              <div
                onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    {getCategoryIcon(course.category)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {course.category}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        {course.level}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 font-tajawal">
                      {course.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-700 font-arabic font-semibold mt-0.5" dir="rtl">
                      {course.titleArabic}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 max-w-xl line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* Progress bar & Toggle */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 sm:min-w-[180px]">
                  <div className="text-left sm:text-right flex-1 sm:flex-initial">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <span>{stats.completed} / {stats.total} Selesai</span>
                      <span className="text-emerald-600 font-bold">({stats.percent}%)</span>
                    </div>
                    <div className="w-full sm:w-36 h-2 bg-slate-100 rounded-full overflow-hidden mt-1.5 border border-slate-200">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${stats.percent}%` }}
                      />
                    </div>
                  </div>

                  <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 transition-transform ${isExpanded ? 'rotate-90 text-emerald-600 bg-emerald-50' : ''}`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Course Lessons List when expanded */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/60 p-4 sm:p-6 space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Daftar Bab & Latihan:
                  </h3>
                  <div className="space-y-2.5">
                    {course.lessons.map((lesson) => {
                      const isCompleted = progressMap[lesson.id]?.completed;
                      const score = progressMap[lesson.id]?.quizScore;

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => onSelectLesson(course, lesson)}
                          className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                lesson.order
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                                  {lesson.title}
                                </h4>
                                {isCompleted && score !== undefined && (
                                  <span className="px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                                    Skor: {score}%
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-emerald-700 font-arabic font-medium" dir="rtl">
                                {lesson.titleArabic}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {lesson.durationMinutes} menit
                                </span>
                                <span>•</span>
                                <span>{lesson.vocabulary.length} Kosakata</span>
                                <span>•</span>
                                <span>{lesson.quiz.length} Soal Kuis</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-emerald-600 group-hover:text-emerald-700 hidden sm:inline">
                              {isCompleted ? 'Pelajari Ulang' : 'Mulai Belajar'}
                            </span>
                            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
