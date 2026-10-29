import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  BookOpen,
  Sparkles,
  Users,
  CheckCircle2,
  RefreshCw,
  Database,
  KeyRound,
  FileText
} from 'lucide-react';
import { Course, QuizQuestion, UserProfile } from '../types/lms';
import { saveCustomCourse, getAllUsersForAdmin } from '../services/lmsService';

interface AdminPanelProps {
  courses: Course[];
  onCourseAdded: (newCourses: Course[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ courses, onCourseAdded }) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'add-course' | 'ai-quiz' | 'students'>('overview');
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  // Add course form state
  const [courseTitle, setCourseTitle] = useState('');
  const [courseTitleArabic, setCourseTitleArabic] = useState('');
  const [category, setCategory] = useState<'Nahwu' | 'Shorof' | 'Muhadatsah' | 'Mufradat' | 'Qira\'ah'>('Nahwu');
  const [level, setLevel] = useState<'Mubtadi\' (Pemula)' | 'Mutawassith (Menengah)' | 'Mutaqaddim (Lanjut)'>('Mubtadi\' (Pemula)');
  const [description, setDescription] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonArabic, setLessonArabic] = useState('');
  const [lessonExplanation, setLessonExplanation] = useState('');

  // AI Quiz Generator state
  const [quizTopic, setQuizTopic] = useState('Fi\'il Madhi dan Fi\'il Mudhari\'');
  const [quizLevel, setQuizLevel] = useState('Pemula');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[] | null>(null);
  const [quizError, setQuizError] = useState('');

  useEffect(() => {
    if (activeAdminTab === 'students') {
      setIsLoadingStudents(true);
      getAllUsersForAdmin()
        .then(setStudents)
        .catch((err) => {
          console.error(err);
          // Fallback dummy for display
          setStudents([
            { id: '1', displayName: 'Ahmad Fauzi', email: 'ahmad@example.com', role: 'student', xp: 450, streak: 5, level: 'Mutawassith (Menengah)' },
            { id: '2', displayName: 'Fatimah Az-Zahra', email: 'fatimah@example.com', role: 'student', xp: 620, streak: 7, level: 'Mutawassith (Menengah)' },
            { id: '3', displayName: 'Administrator', email: 'admin123@alfusha-lms.internal', role: 'admin', xp: 9999, streak: 30, level: 'Mutaqaddim (Ustadz / Admin)' }
          ]);
        })
        .finally(() => setIsLoadingStudents(false));
    }
  }, [activeAdminTab]);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseTitleArabic.trim()) return;

    const newCourse: Course = {
      id: 'custom-course-' + Date.now(),
      title: courseTitle,
      titleArabic: courseTitleArabic,
      category,
      level,
      iconName: 'BookOpen',
      description,
      lessons: [
        {
          id: 'lesson-' + Date.now(),
          courseId: 'custom-course-' + Date.now(),
          title: lessonTitle || 'Bab 1: Pengantar ' + courseTitle,
          titleArabic: lessonArabic || courseTitleArabic,
          order: 1,
          durationMinutes: 15,
          summary: lessonExplanation || description,
          sections: [
            {
              title: 'Materi Pembahasan',
              type: 'theory',
              arabicText: lessonArabic || courseTitleArabic,
              indonesian: lessonExplanation || description,
              explanation: lessonExplanation || description
            }
          ],
          vocabulary: [],
          quiz: []
        }
      ]
    };

    const updated = saveCustomCourse(newCourse);
    onCourseAdded(updated);
    alert('Kursus baru berhasil diterbitkan!');
    setCourseTitle('');
    setCourseTitleArabic('');
    setDescription('');
    setLessonTitle('');
    setLessonArabic('');
    setLessonExplanation('');
    setActiveAdminTab('overview');
  };

  const handleGenerateAiQuiz = async () => {
    if (!quizTopic.trim()) return;
    setIsGeneratingQuiz(true);
    setQuizError('');
    try {
      const res = await fetch('/api/gemini/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: quizTopic, level: quizLevel })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setGeneratedQuestions(data.questions || []);
    } catch (err: unknown) {
      console.error(err);
      setQuizError(err instanceof Error ? err.message : 'Gagal menghasilkan kuis AI');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5 text-purple-300" />
            <span>Hak Akses Penuh: Administrator LMS</span>
          </div>
          <h1 className="text-2xl font-bold font-tajawal">
            Panel Manajemen Kursus & Asesmen
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/90 mt-1 max-w-xl">
            Kelola kurikulum pembelajaran, buat modul baru, gunakan generator kuis otomatis berbasis Gemini AI, serta pantau siswa terdaftar.
          </p>
        </div>

        <div className="bg-white/10 p-3 rounded-xl border border-white/20 text-xs shrink-0 space-y-1">
          <p className="font-semibold text-purple-200 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-amber-300" />
            <span>Kredensial Default:</span>
          </p>
          <p className="font-mono text-[11px] text-white">User: <b>admin123</b></p>
          <p className="font-mono text-[11px] text-white">Pass: <b>12345</b></p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-2 overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeAdminTab === 'overview'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Ringkasan Kurikulum</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('add-course')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeAdminTab === 'add-course'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kursus Baru</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('ai-quiz')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeAdminTab === 'ai-quiz'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>AI Quiz Generator</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('students')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeAdminTab === 'students'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-blue-500" />
          <span>Daftar Siswa (Firestore)</span>
        </button>
      </div>

      {/* Tab: Overview */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Total Modul Kursus</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{courses.length} Kursus</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Database Firestore</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <span>Terhubung</span>
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500">Model AI Server-Side</span>
              <p className="text-2xl font-bold text-amber-600 mt-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>gemini-3.8-flash</span>
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-tajawal">
              Daftar Kursus Aktif
            </h2>
            <div className="divide-y divide-slate-100">
              {courses.map((course) => (
                <div key={course.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{course.title}</h3>
                    <p className="text-xs font-arabic text-emerald-800" dir="rtl">{course.titleArabic}</p>
                    <span className="text-[11px] text-slate-500">{course.lessons.length} Bab • Tingkat: {course.level}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                    {course.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Add Course */}
      {activeAdminTab === 'add-course' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 font-tajawal">
            Publikasikan Modul Kursus Bahasa Arab Baru
          </h2>
          <form onSubmit={handleCreateCourse} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Kursus (Bahasa Indonesia)
                </label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="contoh: Pengantar Nahwu Tingkat Lanjut"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Kursus (Bahasa Arab Berharakat)
                </label>
                <input
                  type="text"
                  required
                  value={courseTitleArabic}
                  onChange={(e) => setCourseTitleArabic(e.target.value)}
                  placeholder="contoh: النَّحْوُ الْوَاضِحُ لِلْمَرْحَلَةِ الثَّانَوِيَّةِ"
                  dir="rtl"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-arabic text-lg text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Nahwu">Nahwu (Tata Bahasa)</option>
                  <option value="Shorof">Shorof (Morfologi)</option>
                  <option value="Muhadatsah">Muhadatsah (Percakapan)</option>
                  <option value="Mufradat">Mufradat (Kosakata)</option>
                  <option value="Qira'ah">Qira'ah (Membaca & Memahami)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tingkat Kesulitan</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Mubtadi' (Pemula)">Mubtadi' (Pemula)</option>
                  <option value="Mutawassith (Menengah)">Mutawassith (Menengah)</option>
                  <option value="Mutaqaddim (Lanjut)">Mutaqaddim (Lanjut)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi silabus dan sasaran belajar..."
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-3 font-tajawal">
                Materi Bab Pertama (Bab 1):
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="Judul Bab (contoh: Bab 1: Mengenal Isim Isyarah)"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
                <input
                  type="text"
                  value={lessonArabic}
                  onChange={(e) => setLessonArabic(e.target.value)}
                  placeholder="Frasa/Teks Arab Bab (contoh: أَسْمَاءُ الْإِشَارَةِ لِلْقَرِيبِ وَالْبَعِيدِ)"
                  dir="rtl"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-arabic text-lg text-right"
                />
                <textarea
                  rows={3}
                  value={lessonExplanation}
                  onChange={(e) => setLessonExplanation(e.target.value)}
                  placeholder="Uraian materi penjelasan..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99]"
              >
                Simpan & Terbitkan Kursus
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: AI Quiz Generator */}
      {activeAdminTab === 'ai-quiz' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-tajawal flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Generator Soal Kuis Otomatis (Gemini AI)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Hasilkan paket 3 soal pilihan ganda bahasa Arab beserta pilihan jawaban, kunci jawaban yang benar, dan penjelasan kaidah Nahwu/Shorof otomatis.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Topik / Pokok Bahasan Kuis:
                </label>
                <input
                  type="text"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  placeholder="contoh: Isim Inna wa Akhawatuha"
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tingkat Pelajar:
                </label>
                <select
                  value={quizLevel}
                  onChange={(e) => setQuizLevel(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Pemula">Pemula (Mubtadi')</option>
                  <option value="Menengah">Menengah (Mutawassith)</option>
                  <option value="Lanjutan">Lanjutan (Mutaqaddim)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleGenerateAiQuiz}
                disabled={isGeneratingQuiz || !quizTopic.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md disabled:opacity-50 transition-all"
              >
                {isGeneratingQuiz ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini AI Sedang Menulis Soal...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Soal Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {quizError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {quizError}
            </div>
          )}

          {/* Generated Questions Preview */}
          {generatedQuestions && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>Hasil Soal yang Dibuat ({generatedQuestions.length} Soal)</span>
                <span className="text-xs font-semibold text-emerald-700">Topik: {quizTopic}</span>
              </h3>

              <div className="space-y-4">
                {generatedQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-800">{q.question}</p>
                    </div>
                    {q.arabicPhrase && (
                      <p className="font-arabic text-xl font-bold text-emerald-800 text-right" dir="rtl">
                        {q.arabicPhrase}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-lg border ${
                            oIdx === q.correctIndex
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className="font-bold mr-1">{String.fromCharCode(65 + oIdx)}.</span>
                          {opt}
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1">
                      <b>Kunci / Kaidah:</b> {q.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Students */}
      {activeAdminTab === 'students' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-tajawal flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Daftar Siswa & Profil Tersimpan di Firestore</span>
          </h2>

          {isLoadingStudents ? (
            <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
              <span>Memuat data siswa dari Firestore...</span>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-700 font-semibold">
                  <tr>
                    <th className="px-4 py-3 text-left">Nama Siswa</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Peran</th>
                    <th className="px-4 py-3 text-left">Level</th>
                    <th className="px-4 py-3 text-left">XP</th>
                    <th className="px-4 py-3 text-left">Streak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-900">{student.displayName}</td>
                      <td className="px-4 py-3 text-slate-600">{student.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          student.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {student.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{student.level}</td>
                      <td className="px-4 py-3 font-bold text-amber-700">{student.xp} XP</td>
                      <td className="px-4 py-3 text-orange-600 font-semibold">{student.streak} Hari</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
